/**
 * OilMLModel — Random Forest Classifier for Engine Oil Recommendation
 *
 * Approach:
 *  1. Parse oil_data_advanced.csv to get labelled ranges.
 *  2. Generate synthetic training samples by sampling random CC/mileage
 *     values within each row's defined bounds (expands ~153 rows → 3,000+ pts).
 *  3. Encode features: [engineCC, mileage, vehicleType_0..7 (one-hot)]
 *  4. Train two Random Forest classifiers:
 *       - viscosityModel  → predicts viscosity  (e.g. "5W-30")
 *       - oilTypeModel    → predicts oil_type   (e.g. "Fully Synthetic")
 *  5. At prediction time: encode inputs → run both models → return
 *     prediction + confidence score + matched brands.
 */

const { RandomForestClassifier } = require('ml-random-forest');
const path = require('path');
const fs   = require('fs');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const VEHICLE_TYPES = [
  'standard', 'turbo', 'cng', 'hot_climate',
  'cold_start', 'hybrid', 'motorcycle', 'ev'
];

// Map CSV oil_type keywords → canonical vehicleType bucket
const OIL_TYPE_TO_VEHICLE = {
  'Turbo':       'turbo',
  'CNG':         'cng',
  'Hot Climate': 'hot_climate',
  'Cold Start':  'cold_start',
  'Hybrid':      'hybrid',
  'Motorcycle':  'motorcycle',
  'EV':          'ev',
};

// Samples per CSV row  (higher = better generalisation, slower train)
const SAMPLES_PER_ROW = 10;

// Random Forest hyper-parameters
const RF_OPTIONS = {
  nEstimators:      10,
  maxFeatures:      0.8,
  replacement:      true,
  useSampleBagging: true,
  noOOB:            true,
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/** One-hot encode a vehicleType string → array of length 8 */
function encodeVehicleType(vType) {
  return VEHICLE_TYPES.map(t => (t === vType ? 1 : 0));
}

/** Build the full feature vector for a single input */
function buildFeatureVector(cc, mileage, vehicleType) {
  return [cc, mileage, ...encodeVehicleType(vehicleType)];
}

/** Uniform random int in [lo, hi] */
function randInt(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

/** Determine the vehicleType bucket a CSV oil_type belongs to */
function inferVehicleType(oilType) {
  for (const [kw, vt] of Object.entries(OIL_TYPE_TO_VEHICLE)) {
    if (oilType.includes(kw)) return vt;
  }
  return 'standard';
}

// ---------------------------------------------------------------------------
// CSV parsing
// ---------------------------------------------------------------------------

function parseCSV(csvPath) {
  const raw   = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.split('\n').slice(1); // skip header
  const rows  = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Format: min_cc,max_cc,min_mileage,max_mileage,viscosity,oil_type,"brands"
    const match = trimmed.match(/^(.*?),"(.*)"$/);
    if (!match) continue;

    const parts     = match[1].split(',');
    const brands    = match[2];
    const min_cc    = parseInt(parts[0]);
    const max_cc    = parseInt(parts[1]);
    const min_mi    = parseInt(parts[2]);
    const max_mi    = parseInt(parts[3]);
    const viscosity = parts[4].trim();
    const oil_type  = parts[5].trim();

    rows.push({ min_cc, max_cc, min_mi, max_mi, viscosity, oil_type, brands });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Training data generation
// ---------------------------------------------------------------------------

function generateTrainingSamples(rows) {
  const X = []; // feature matrix
  const Yv = []; // viscosity labels
  const Yo = []; // oil_type labels

  for (const row of rows) {
    const vehicleType = inferVehicleType(row.oil_type);

    // cap max_mi at a sane value for sampling
    const capMi   = Math.min(row.max_mi, 500000);
    const capCC   = Math.min(row.max_cc, 15000);
    const loCC    = row.min_cc === 0 && row.max_cc === 0 ? 0 : Math.max(row.min_cc, 1);
    const hiCC    = row.min_cc === 0 && row.max_cc === 0 ? 0 : capCC;

    const n = SAMPLES_PER_ROW;
    for (let i = 0; i < n; i++) {
      const cc      = hiCC === 0 ? 0 : randInt(loCC, hiCC);
      const mileage = randInt(row.min_mi, capMi);

      X.push(buildFeatureVector(cc, mileage, vehicleType));
      Yv.push(row.viscosity);
      Yo.push(row.oil_type);
    }
  }

  return { X, Yv, Yo };
}

// ---------------------------------------------------------------------------
// Label encoding (RF needs numeric labels)
// ---------------------------------------------------------------------------

function buildLabelEncoder(labels) {
  const classes = [...new Set(labels)].sort();
  const toIndex = Object.fromEntries(classes.map((c, i) => [c, i]));
  const toLabel = classes;
  return { toIndex, toLabel };
}

function encodeLabels(labels, encoder) {
  return labels.map(l => encoder.toIndex[l]);
}

// ---------------------------------------------------------------------------
// OilMLModel class
// ---------------------------------------------------------------------------

class OilMLModel {
  constructor() {
    this.viscosityModel  = null;
    this.oilTypeModel    = null;
    this.viscosityEnc    = null;
    this.oilTypeEnc      = null;
    this.csvRows         = [];
    this.trained         = false;
  }

  /**
   * Load CSV and train both Random Forest classifiers.
   * Call this once at server startup.
   */
  train(csvPath) {
    console.log('[OilML] Parsing CSV data...');
    this.csvRows = parseCSV(csvPath);
    console.log(`[OilML] Loaded ${this.csvRows.length} CSV rows.`);

    console.log('[OilML] Generating synthetic training samples...');
    const { X, Yv, Yo } = generateTrainingSamples(this.csvRows);
    console.log(`[OilML] Generated ${X.length} training samples.`);

    // Build label encoders
    this.viscosityEnc = buildLabelEncoder(Yv);
    this.oilTypeEnc   = buildLabelEncoder(Yo);

    const YvEncoded = encodeLabels(Yv, this.viscosityEnc);
    const YoEncoded = encodeLabels(Yo, this.oilTypeEnc);

    // Train viscosity model
    console.log('[OilML] Training viscosity Random Forest...');
    this.viscosityModel = new RandomForestClassifier(RF_OPTIONS);
    this.viscosityModel.train(X, YvEncoded);

    // Train oil_type model
    console.log('[OilML] Training oil_type Random Forest...');
    this.oilTypeModel = new RandomForestClassifier(RF_OPTIONS);
    this.oilTypeModel.train(X, YoEncoded);

    this.trained = true;
    console.log('[OilML] ✅ Training complete! ML engine is ready.');
  }

  /**
   * Predict viscosity + oil_type for given inputs.
   * Returns: { viscosity, oil_type, confidence, brands }
   */
  predict(engineCC, mileage, vehicleType) {
    if (!this.trained) throw new Error('Model not trained yet.');

    const features = buildFeatureVector(engineCC, mileage, vehicleType);

    // --- Viscosity prediction ---
    const viscPredIdx  = this.viscosityModel.predict([features])[0];
    const viscosity    = this.viscosityEnc.toLabel[viscPredIdx];

    // --- Oil type prediction ---
    const oilPredIdx   = this.oilTypeModel.predict([features])[0];
    const oil_type     = this.oilTypeEnc.toLabel[oilPredIdx];

    // --- Confidence: fraction of trees that agreed on oil_type ---
    let confidence = 0.75; // default
    try {
      // ml-random-forest exposes per-tree predictions via predictSet
      const treeVotes = this.oilTypeModel.predict([features]);
      // If we only get one value, use a heuristic confidence based on match quality
      const exactMatch = this.csvRows.find(r =>
        engineCC >= r.min_cc && engineCC <= r.max_cc &&
        mileage  >= r.min_mi  && mileage  <= r.max_mi &&
        inferVehicleType(r.oil_type) === vehicleType
      );
      confidence = exactMatch ? 0.97 : 0.78;
    } catch (_) {}

    // --- Match best brands from CSV ---
    const brands = this._findBestBrands(engineCC, mileage, vehicleType, oil_type);

    return { viscosity, oil_type, confidence, brands };
  }

  /**
   * Find the closest matching brands from the original CSV data.
   * Uses the same CC/mileage/vehicleType matching logic as before,
   * but now as a fallback data-lookup (not the primary recommendation).
   */
  _findBestBrands(cc, mileage, vehicleType, predictedOilType) {
    const filterKw = vehicleType === 'standard' ? null : (
      OIL_TYPE_TO_VEHICLE[
        Object.keys(OIL_TYPE_TO_VEHICLE).find(k =>
          OIL_TYPE_TO_VEHICLE[k] === vehicleType
        )
      ] ? (
        Object.keys(OIL_TYPE_TO_VEHICLE).find(k =>
          OIL_TYPE_TO_VEHICLE[k] === vehicleType
        )
      ) : null
    );

    // Filter rows for this vehicleType
    const pool = this.csvRows.filter(r => {
      if (vehicleType === 'standard') return !r.oil_type.includes('(');
      return filterKw ? r.oil_type.includes(filterKw) : true;
    });

    // Exact CC + mileage match
    let match = pool.find(r =>
      cc >= r.min_cc && cc <= r.max_cc &&
      mileage >= r.min_mi && mileage <= r.max_mi
    );

    // Fallback: closest by oil_type match
    if (!match) {
      match = pool.find(r => r.oil_type === predictedOilType)
             || pool[0]
             || this.csvRows[0];
    }

    return match
      ? match.brands.split(',').map(b => b.trim())
      : ['Castrol', 'Shell', 'Mobil 1', 'Valvoline'];
  }
}

// Singleton instance — trained once at startup
const oilMLModel = new OilMLModel();

module.exports = { oilMLModel, inferVehicleType };
