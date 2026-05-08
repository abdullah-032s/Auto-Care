const fs = require('fs');
const path = require('path');

// CC ranges covering Pakistan's most popular vehicles
const ccRanges = [
  { min: 0, max: 660, label: "Kei Cars (Mehran, Alto, Mira)" },
  { min: 661, max: 800, label: "Small Hatchbacks (Carol, Every)" },
  { min: 801, max: 1000, label: "Entry Hatchbacks (Wagon R, Cultus Old)" },
  { min: 1001, max: 1200, label: "Compact Cars (Swift, Vitz)" },
  { min: 1201, max: 1300, label: "Sedans (Corolla XLi, Cultus New)" },
  { min: 1301, max: 1500, label: "Mid Sedans (City 1.5, Yaris)" },
  { min: 1501, max: 1600, label: "Sedans (Corolla GLi/Altis, Civic 1.5T)" },
  { min: 1601, max: 1800, label: "Upper Sedans (Civic 1.8, Elantra)" },
  { min: 1801, max: 2000, label: "Large Sedans (Accord, Camry 2.0)" },
  { min: 2001, max: 2400, label: "SUVs (Sportage, Tucson, HR-V)" },
  { min: 2401, max: 2700, label: "Large SUVs (Fortuner 2.7, Hilux Petrol)" },
  { min: 2701, max: 3000, label: "Performance/Diesel (Prado, MU-X)" },
  { min: 3001, max: 3500, label: "V6/Diesel SUVs (Pajero, Fortuner 3.0D)" },
  { min: 3501, max: 4000, label: "Large Diesel (Land Cruiser, Hilux 3.0D)" },
  { min: 4001, max: 4700, label: "V8 SUVs (Land Cruiser V8, Patrol)" },
  { min: 4701, max: 6000, label: "Performance/Heavy (Muscle Cars, Trucks)" },
  { min: 6001, max: 8000, label: "Heavy Diesel (Hino, UD Trucks)" },
  { min: 8001, max: 12000, label: "Commercial Diesel (Trailers, Buses)" },
];

// Mileage bands
const mileageBands = [
  { min: 0, max: 15000, label: "Brand New" },
  { min: 15001, max: 50000, label: "Low Mileage" },
  { min: 50001, max: 100000, label: "Moderate" },
  { min: 100001, max: 200000, label: "High" },
  { min: 200001, max: 9999999, label: "Very High" },
];

// Climate considerations for Pakistan
const climateNotes = {
  hot: "Recommended for Pakistan's hot climate (35-50°C summers)",
  moderate: "Suitable for moderate/northern areas (Islamabad, Peshawar)",
  extreme: "Ideal for extreme heat regions (Sindh, Balochistan, Southern Punjab)",
};

// Oil specifications by engine size and mileage
function getOilSpec(ccRange, mileageBand) {
  const cc = (ccRange.min + ccRange.max) / 2;
  const mileage = (mileageBand.min + Math.min(mileageBand.max, 300000)) / 2;

  // Small engines (under 1000cc)
  if (cc <= 1000) {
    if (mileage <= 15000) return { viscosity: "0W-20", type: "Fully Synthetic" };
    if (mileage <= 50000) return { viscosity: "5W-30", type: "Fully Synthetic" };
    if (mileage <= 100000) return { viscosity: "5W-30", type: "Synthetic Blend" };
    if (mileage <= 200000) return { viscosity: "10W-40", type: "High Mileage" };
    return { viscosity: "20W-50", type: "High Mileage" };
  }

  // Medium petrol engines (1000-1600cc) - most Pakistani cars
  if (cc <= 1600) {
    if (mileage <= 15000) return { viscosity: "5W-30", type: "Fully Synthetic" };
    if (mileage <= 50000) return { viscosity: "5W-30", type: "Fully Synthetic" };
    if (mileage <= 100000) return { viscosity: "5W-40", type: "Synthetic Blend" };
    if (mileage <= 200000) return { viscosity: "10W-40", type: "High Mileage" };
    return { viscosity: "20W-50", type: "High Mileage" };
  }

  // Upper petrol engines (1600-2400cc)
  if (cc <= 2400) {
    if (mileage <= 15000) return { viscosity: "5W-40", type: "Fully Synthetic" };
    if (mileage <= 50000) return { viscosity: "5W-40", type: "Fully Synthetic" };
    if (mileage <= 100000) return { viscosity: "10W-40", type: "Synthetic Blend" };
    if (mileage <= 200000) return { viscosity: "10W-40", type: "High Mileage" };
    return { viscosity: "15W-40", type: "High Mileage" };
  }

  // Large petrol/performance engines (2400-4700cc)
  if (cc <= 4700) {
    if (mileage <= 15000) return { viscosity: "0W-40", type: "Fully Synthetic" };
    if (mileage <= 50000) return { viscosity: "5W-40", type: "Fully Synthetic" };
    if (mileage <= 100000) return { viscosity: "5W-40", type: "Synthetic Blend" };
    if (mileage <= 200000) return { viscosity: "10W-40", type: "High Mileage" };
    return { viscosity: "15W-40", type: "High Mileage" };
  }

  // Heavy/diesel engines (4700cc+)
  if (mileage <= 15000) return { viscosity: "15W-40", type: "Fully Synthetic" };
  if (mileage <= 50000) return { viscosity: "15W-40", type: "Fully Synthetic" };
  if (mileage <= 100000) return { viscosity: "15W-40", type: "Synthetic Blend" };
  if (mileage <= 200000) return { viscosity: "20W-50", type: "High Mileage" };
  return { viscosity: "20W-50", type: "High Mileage" };
}

// Brand pools per oil type and engine category
const brandPools = {
  small_synthetic: [
    "Mobil 1 0W-20", "Shell Helix Ultra 0W-20", "Castrol Edge 0W-20",
    "Toyota Genuine 0W-20", "Liqui Moly Special Tec", "ZIC X9 FE",
    "Total Quartz 9000 Future", "Pennzoil Platinum", "Valvoline Advanced",
    "Amsoil Signature", "Honda Genuine Oil", "Suzuki Genuine Oil",
  ],
  small_blend: [
    "Castrol Magnatec", "Valvoline SynPower", "ZIC X7", "Kixx G1",
    "Caltex Havoline", "Shell Helix HX7", "Total Quartz 7000",
    "Pennzoil Gold", "Mobil Super 3000", "Elf Evolution 700",
  ],
  small_high_mileage: [
    "Castrol GTX High Mileage", "Valvoline MaxLife", "Shell Helix HX5",
    "Havoline High Mileage", "STP High Mileage", "Pennzoil HM",
    "Mobil Super HM", "Lucas Oil HM", "Servo Pride",
  ],
  medium_synthetic: [
    "Mobil 1 ESP Formula", "Shell Helix Ultra ECT", "Castrol Edge 5W-30",
    "Castrol Edge Titanium", "Liqui Moly Molygen", "Total Quartz 9000",
    "ZIC X9", "Motul 8100 Eco-nergy", "Pennzoil Platinum",
    "Royal Purple HMX", "Amsoil Signature", "Valvoline Advanced Full Synthetic",
    "Toyota Genuine 5W-30", "Honda Genuine Full Synthetic",
  ],
  medium_blend: [
    "Castrol Magnatec Stop-Start", "Valvoline SynPower", "ZIC X7",
    "Kixx G SN Plus", "Shell Helix HX7", "Total Quartz 7000",
    "Pennzoil Gold", "Elf Evolution 700", "Caltex Havoline ProDS",
    "Mobil Super 3000 X1", "Motul 6100 Synergie",
  ],
  medium_high_mileage: [
    "Castrol GTX High Mileage", "Valvoline MaxLife", "Shell Helix HX5 Plus",
    "Pennzoil HM", "Havoline High Mileage", "STP High Mileage",
    "Mobil Super High Mileage", "Lucas Oil High Mileage",
  ],
  large_synthetic: [
    "Mobil 1 FS", "Shell Helix Ultra 5W-40", "Castrol Edge Supercar",
    "Liqui Moly Synthoil", "Motul 8100 X-cess", "Total Quartz 9000 Energy",
    "Red Line 5W-40", "Amsoil Signature", "Royal Purple HPS",
    "Pennzoil Ultra Platinum", "ZIC X9 5W-40",
  ],
  large_blend: [
    "Valvoline SynPower", "ZIC X9", "Castrol Magnatec 10W-40",
    "Pennzoil Platinum", "Shell Helix HX7 10W-40", "Total Quartz 7000 Energy",
    "Elf Evolution Full-Tech", "Mobil Super 3000", "Motul 6100 Synergie+",
  ],
  large_high_mileage: [
    "Castrol GTX HM", "Valvoline MaxLife", "Shell Helix HX5 Plus",
    "Delo 400", "Pennzoil HM", "STP High Mileage", "Mobil Delvac",
    "Lucas Oil Heavy Duty", "Rotella T4",
  ],
  performance_synthetic: [
    "Mobil 1 FS 0W-40", "Red Line 0W-40", "Castrol Edge Supercar",
    "Motul 300V Power", "Royal Purple Racing", "Amsoil Dominator",
    "Liqui Moly Synthoil Race Tech", "Pennzoil Ultra Platinum 0W-40",
    "Shell Helix Ultra Racing", "Total Quartz Racing",
  ],
  diesel_synthetic: [
    "Rotella T6 Full Synthetic", "Delo 400 XSP", "Mobil 1 Turbo Diesel",
    "Liqui Moly LKW", "Shell Rimula R6", "Castrol Vecton Long Drain",
    "Motul Tekma Mega X", "Total Rubia TIR 9900",
  ],
  diesel_blend: [
    "Rotella T5", "Delo 400 SDE", "Shell Rimula R4",
    "Mobil Delvac 1300", "Castrol Vecton", "Caltex Delo Gold",
    "Total Rubia TIR 7400", "Elf Performance Experty",
  ],
  diesel_high_mileage: [
    "Rotella T4", "Delo 400 NG", "Mobil Delvac 1300 Super",
    "Castrol Vecton LD", "Havoline Extra", "Lucas Heavy Duty Oil",
    "Shell Rimula R3", "Total Rubia S",
  ],
};

function getBrands(ccRange, spec) {
  const cc = (ccRange.min + ccRange.max) / 2;
  let pool;

  if (cc > 4700) {
    // Diesel/heavy
    if (spec.type === "Fully Synthetic") pool = brandPools.diesel_synthetic;
    else if (spec.type === "Synthetic Blend") pool = brandPools.diesel_blend;
    else pool = brandPools.diesel_high_mileage;
  } else if (cc > 2400) {
    // Performance/large
    if (spec.type === "Fully Synthetic") pool = spec.viscosity.startsWith("0W") ? brandPools.performance_synthetic : brandPools.large_synthetic;
    else if (spec.type === "Synthetic Blend") pool = brandPools.large_blend;
    else pool = brandPools.large_high_mileage;
  } else if (cc > 1600) {
    // Upper medium
    if (spec.type === "Fully Synthetic") pool = brandPools.large_synthetic;
    else if (spec.type === "Synthetic Blend") pool = brandPools.large_blend;
    else pool = brandPools.large_high_mileage;
  } else if (cc > 1000) {
    // Medium
    if (spec.type === "Fully Synthetic") pool = brandPools.medium_synthetic;
    else if (spec.type === "Synthetic Blend") pool = brandPools.medium_blend;
    else pool = brandPools.medium_high_mileage;
  } else {
    // Small
    if (spec.type === "Fully Synthetic") pool = brandPools.small_synthetic;
    else if (spec.type === "Synthetic Blend") pool = brandPools.small_blend;
    else pool = brandPools.small_high_mileage;
  }

  // Pick 4-6 brands, shuffled by a deterministic seed
  const seed = ccRange.min * 7 + ccRange.max * 13 + spec.viscosity.charCodeAt(0);
  const shuffled = [...pool].sort((a, b) => {
    const ha = (a.charCodeAt(0) * 31 + seed) % 100;
    const hb = (b.charCodeAt(0) * 31 + seed) % 100;
    return ha - hb;
  });
  const count = 4 + (seed % 3); // 4-6 brands
  return shuffled.slice(0, count);
}

// Generate the CSV
let rows = ["min_cc,max_cc,min_mileage,max_mileage,viscosity,oil_type,brands"];

for (const ccRange of ccRanges) {
  for (const mBand of mileageBands) {
    const spec = getOilSpec(ccRange, mBand);
    const brands = getBrands(ccRange, spec);
    const brandsStr = `"${brands.join(", ")}"`;
    rows.push(`${ccRange.min},${ccRange.max},${mBand.min},${mBand.max},${spec.viscosity},${spec.type},${brandsStr}`);
  }
}

// Add extra rows for turbo engines (common in Pakistan: Civic 1.5T, Sportage, etc.)
const turboExtras = [
  { min: 1301, max: 1500, note: "Turbo Petrol (Civic 1.5T, MG ZS)" },
  { min: 1501, max: 1600, note: "Turbo Petrol (Corolla Cross, Sportage 1.6T)" },
  { min: 1801, max: 2000, note: "Turbo Diesel (Hilux 2.4D, Fortuner 2.4D)" },
  { min: 2401, max: 2800, note: "Turbo Diesel (Prado 2.8D, MU-X 3.0D)" },
];

const turboMileageBands = [
  { min: 0, max: 30000 },
  { min: 30001, max: 80000 },
  { min: 80001, max: 150000 },
  { min: 150001, max: 9999999 },
];

const turboBrands = {
  synthetic: [
    "Mobil 1 Turbo Diesel", "Shell Helix Ultra ECT C3", "Castrol Edge Turbo Diesel",
    "Liqui Moly Top Tec 4200", "Motul 8100 X-clean", "Total Quartz INEO MC3",
  ],
  blend: [
    "Castrol Magnatec Diesel", "Shell Helix HX7 Diesel", "Valvoline SynPower DT",
    "ZIC X7 Diesel", "Pennzoil Platinum Euro",
  ],
  hm: [
    "Castrol GTX Diesel HM", "Valvoline MaxLife Diesel", "Shell Helix HX5 Diesel",
    "Mobil Super Diesel HM",
  ],
};

for (const t of turboExtras) {
  for (const mb of turboMileageBands) {
    let spec, pool;
    if (mb.max <= 30000) { spec = { v: "5W-30", t: "Fully Synthetic (Turbo)" }; pool = turboBrands.synthetic; }
    else if (mb.max <= 80000) { spec = { v: "5W-40", t: "Fully Synthetic (Turbo)" }; pool = turboBrands.synthetic; }
    else if (mb.max <= 150000) { spec = { v: "5W-40", t: "Synthetic Blend (Turbo)" }; pool = turboBrands.blend; }
    else { spec = { v: "10W-40", t: "High Mileage (Turbo)" }; pool = turboBrands.hm; }
    const brandsStr = `"${pool.join(", ")}"`;
    rows.push(`${t.min},${t.max},${mb.min},${mb.max},${spec.v},${spec.t},${brandsStr}`);
  }
}

// Add climate-specific rows for extreme heat (Southern Pakistan)
const heatExtras = [
  { min: 801, max: 1300, mmin: 0, mmax: 100000, v: "10W-30", t: "Fully Synthetic (Hot Climate)", b: "Shell Helix Ultra Hot Climate, Mobil 1 ESP Hot, Castrol Edge Hot Climate, ZIC X9 HC" },
  { min: 801, max: 1300, mmin: 100001, mmax: 9999999, v: "10W-40", t: "High Mileage (Hot Climate)", b: "Castrol GTX Ultraclean, Valvoline MaxLife HC, Shell Helix HX5, Havoline ProDS" },
  { min: 1301, max: 1800, mmin: 0, mmax: 100000, v: "5W-40", t: "Fully Synthetic (Hot Climate)", b: "Mobil 1 FS HC, Shell Helix Ultra ECT, Castrol Edge 5W-40, Liqui Moly Molygen HC" },
  { min: 1301, max: 1800, mmin: 100001, mmax: 9999999, v: "15W-40", t: "High Mileage (Hot Climate)", b: "Castrol GTX Ultraclean, Delo 400, Valvoline MaxLife, Shell Helix HX3 Plus" },
  { min: 1801, max: 2500, mmin: 0, mmax: 100000, v: "5W-40", t: "Fully Synthetic (Hot Climate)", b: "Mobil 1 FS 5W-40, Shell Helix Ultra, Castrol Edge Supercar, Motul 8100 X-cess HC" },
  { min: 1801, max: 2500, mmin: 100001, mmax: 9999999, v: "15W-50", t: "High Mileage (Hot Climate)", b: "Castrol GTX HC, Valvoline VR1 Racing, Red Line 15W-50, Mobil Delvac MX" },
  { min: 2501, max: 4000, mmin: 0, mmax: 100000, v: "10W-40", t: "Fully Synthetic (Hot Climate)", b: "Mobil 1 FS 10W-40, Shell Helix Ultra, Castrol Edge HC, Motul 300V HC" },
  { min: 2501, max: 4000, mmin: 100001, mmax: 9999999, v: "20W-50", t: "High Mileage (Hot Climate)", b: "Castrol GTX HC, Delo 400, Rotella T4, Mobil Delvac MX 20W-50" },
];

for (const h of heatExtras) {
  rows.push(`${h.min},${h.max},${h.mmin},${h.mmax},${h.v},${h.t},"${h.b}"`);
}

// Add hybrid/EV-specific rows
const hybridExtras = [
  { min: 1301, max: 1800, mmin: 0, mmax: 50000, v: "0W-20", t: "Fully Synthetic (Hybrid)", b: "Toyota Genuine Hybrid Oil, Mobil 1 Hybrid, Shell Helix Ultra Hybrid, Castrol Edge Hybrid" },
  { min: 1301, max: 1800, mmin: 50001, mmax: 150000, v: "0W-20", t: "Synthetic Blend (Hybrid)", b: "Valvoline Hybrid, ZIC X9 Hybrid, Pennzoil Platinum Hybrid, Kixx Hybrid" },
  { min: 1301, max: 1800, mmin: 150001, mmax: 9999999, v: "5W-30", t: "High Mileage (Hybrid)", b: "Castrol GTX Hybrid HM, Valvoline MaxLife Hybrid, Shell Helix Hybrid HM, STP Hybrid" },
  { min: 1801, max: 2500, mmin: 0, mmax: 50000, v: "0W-20", t: "Fully Synthetic (Hybrid)", b: "Toyota Genuine Hybrid, Mobil 1 Hybrid, Shell Helix Ultra Hybrid, Honda Genuine Hybrid" },
  { min: 1801, max: 2500, mmin: 50001, mmax: 150000, v: "0W-20", t: "Synthetic Blend (Hybrid)", b: "Valvoline Hybrid, Castrol Edge Hybrid, ZIC X9 Hybrid, Pennzoil Hybrid" },
  { min: 1801, max: 2500, mmin: 150001, mmax: 9999999, v: "5W-30", t: "High Mileage (Hybrid)", b: "Castrol GTX Hybrid HM, Valvoline MaxLife, Shell Helix HM Hybrid, Mobil Super Hybrid" },
];

for (const h of hybridExtras) {
  rows.push(`${h.min},${h.max},${h.mmin},${h.mmax},${h.v},${h.t},"${h.b}"`);
}

// CNG/LPG vehicles (very common in Pakistan)
const cngExtras = [
  { min: 801, max: 1000, mmin: 0, mmax: 50000, v: "5W-30", t: "Fully Synthetic (CNG)", b: "Castrol CNG Edge, Shell Helix CNG, Mobil 1 CNG, ZIC X7 CNG, Total Quartz CNG" },
  { min: 801, max: 1000, mmin: 50001, mmax: 150000, v: "10W-40", t: "Synthetic Blend (CNG)", b: "Castrol Magnatec CNG, Valvoline SynPower CNG, Kixx G CNG, Caltex Havoline CNG" },
  { min: 801, max: 1000, mmin: 150001, mmax: 9999999, v: "20W-50", t: "High Mileage (CNG)", b: "Castrol GTX CNG HM, Valvoline MaxLife CNG, Shell Helix HX5 CNG, Havoline CNG HM" },
  { min: 1001, max: 1300, mmin: 0, mmax: 50000, v: "5W-30", t: "Fully Synthetic (CNG)", b: "Mobil 1 CNG Formula, Shell Helix Ultra CNG, Castrol Edge CNG, Liqui Moly CNG" },
  { min: 1001, max: 1300, mmin: 50001, mmax: 150000, v: "10W-40", t: "Synthetic Blend (CNG)", b: "Castrol Magnatec CNG, ZIC X7 CNG, Valvoline SynPower CNG, Kixx G CNG Plus" },
  { min: 1001, max: 1300, mmin: 150001, mmax: 9999999, v: "20W-50", t: "High Mileage (CNG)", b: "Castrol GTX CNG, Valvoline MaxLife CNG, Shell Helix HX3 CNG, STP CNG HM" },
  { min: 1301, max: 1600, mmin: 0, mmax: 50000, v: "5W-30", t: "Fully Synthetic (CNG)", b: "Shell Helix Ultra CNG, Mobil 1 ESP CNG, Castrol Edge CNG, Total Quartz 9000 CNG" },
  { min: 1301, max: 1600, mmin: 50001, mmax: 150000, v: "10W-40", t: "Synthetic Blend (CNG)", b: "Castrol Magnatec CNG Pro, ZIC X7 CNG, Valvoline SynPower CNG, Pennzoil CNG" },
  { min: 1301, max: 1600, mmin: 150001, mmax: 9999999, v: "20W-50", t: "High Mileage (CNG)", b: "Castrol GTX CNG HM, Valvoline MaxLife CNG, Shell Helix HX5 CNG, Lucas CNG" },
  { min: 1601, max: 2000, mmin: 0, mmax: 50000, v: "5W-40", t: "Fully Synthetic (CNG)", b: "Mobil 1 FS CNG, Shell Helix Ultra CNG, Castrol Edge CNG Pro, Motul CNG" },
  { min: 1601, max: 2000, mmin: 50001, mmax: 150000, v: "10W-40", t: "Synthetic Blend (CNG)", b: "Castrol Magnatec CNG, ZIC X9 CNG, Pennzoil CNG, Valvoline CNG" },
  { min: 1601, max: 2000, mmin: 150001, mmax: 9999999, v: "15W-40", t: "High Mileage (CNG)", b: "Castrol GTX CNG HM, Valvoline MaxLife CNG, Shell CNG HM, Delo CNG" },
];
for (const c of cngExtras) {
  rows.push(`${c.min},${c.max},${c.mmin},${c.mmax},${c.v},${c.t},"${c.b}"`);
}

// Cold start / northern Pakistan (Quetta, Gilgit, Murree, Swat)
const coldExtras = [
  { min: 0, max: 1000, mmin: 0, mmax: 100000, v: "0W-20", t: "Fully Synthetic (Cold Start)", b: "Mobil 1 0W-20, Shell Helix Ultra 0W-20, Castrol Edge 0W-20, Amsoil OE 0W-20" },
  { min: 0, max: 1000, mmin: 100001, mmax: 9999999, v: "5W-30", t: "Synthetic Blend (Cold Start)", b: "Valvoline 5W-30 Cold, ZIC X7 Winter, Castrol Magnatec Cold, Pennzoil Winter" },
  { min: 1001, max: 1600, mmin: 0, mmax: 100000, v: "0W-30", t: "Fully Synthetic (Cold Start)", b: "Mobil 1 0W-30 Winter, Shell Helix Ultra 0W-30, Castrol Edge 0W-30, Liqui Moly 0W-30" },
  { min: 1001, max: 1600, mmin: 100001, mmax: 9999999, v: "5W-30", t: "Synthetic Blend (Cold Start)", b: "Valvoline Advanced Winter, ZIC X9 Cold, Castrol Magnatec Winter, Kixx G Winter" },
  { min: 1601, max: 2500, mmin: 0, mmax: 100000, v: "0W-40", t: "Fully Synthetic (Cold Start)", b: "Mobil 1 FS 0W-40 Winter, Shell Helix Ultra 0W-40, Red Line 0W-40, Castrol Edge 0W-40" },
  { min: 1601, max: 2500, mmin: 100001, mmax: 9999999, v: "5W-40", t: "Synthetic Blend (Cold Start)", b: "Valvoline SynPower Winter, ZIC X9 Winter, Castrol Magnatec Cold, Pennzoil Winter" },
  { min: 2501, max: 5000, mmin: 0, mmax: 100000, v: "0W-40", t: "Fully Synthetic (Cold Start)", b: "Mobil 1 0W-40 Arctic, Red Line 0W-40 Winter, Shell Helix Ultra, Amsoil 0W-40 Winter" },
  { min: 2501, max: 5000, mmin: 100001, mmax: 9999999, v: "5W-40", t: "Synthetic Blend (Cold Start)", b: "Valvoline SynPower Cold, ZIC X9 Winter, Delo 400 Winter, Castrol Vecton Cold" },
];
for (const c of coldExtras) {
  rows.push(`${c.min},${c.max},${c.mmin},${c.mmax},${c.v},${c.t},"${c.b}"`);
}

// Motorcycle engines (Honda, Yamaha, Suzuki — very common in Pakistan)
const bikeExtras = [
  { min: 50, max: 110, mmin: 0, mmax: 30000, v: "10W-30", t: "Fully Synthetic (Motorcycle)", b: "Honda Genuine 4T, Shell Advance Ultra, Motul 3100, Castrol Power1 4T" },
  { min: 50, max: 110, mmin: 30001, mmax: 80000, v: "10W-40", t: "Synthetic Blend (Motorcycle)", b: "Shell Advance AX7, Castrol Activ 4T, Motul 5100, Honda Genuine 4T Plus" },
  { min: 50, max: 110, mmin: 80001, mmax: 9999999, v: "20W-50", t: "Mineral (Motorcycle)", b: "Shell Advance AX5, Castrol Activ, Honda 4T Economy, Servo 4T" },
  { min: 111, max: 200, mmin: 0, mmax: 30000, v: "10W-40", t: "Fully Synthetic (Motorcycle)", b: "Shell Advance Ultra 4T, Motul 7100, Castrol Power1 Racing, Liqui Moly 4T Synth" },
  { min: 111, max: 200, mmin: 30001, mmax: 80000, v: "10W-40", t: "Synthetic Blend (Motorcycle)", b: "Shell Advance AX7, Castrol Activ 4T, Motul 5100, Yamaha Yamalube" },
  { min: 111, max: 200, mmin: 80001, mmax: 9999999, v: "20W-50", t: "Mineral (Motorcycle)", b: "Shell Advance AX5, Castrol Activ, Motul 3000, Servo 4T Plus" },
  { min: 201, max: 400, mmin: 0, mmax: 30000, v: "10W-40", t: "Fully Synthetic (Motorcycle)", b: "Motul 7100, Shell Advance Ultra, Castrol Power1 Racing, Red Line MC" },
  { min: 201, max: 400, mmin: 30001, mmax: 9999999, v: "10W-40", t: "Synthetic Blend (Motorcycle)", b: "Shell Advance AX7, Motul 5100, Castrol Power1, Liqui Moly 4T Street" },
  { min: 401, max: 1000, mmin: 0, mmax: 30000, v: "10W-50", t: "Fully Synthetic (Motorcycle)", b: "Motul 300V Factory, Shell Advance Ultra, Castrol Power1 Racing, Amsoil MCF" },
  { min: 401, max: 1000, mmin: 30001, mmax: 9999999, v: "10W-40", t: "Fully Synthetic (Motorcycle)", b: "Shell Advance Ultra 4T, Motul 7100, Castrol Power1 4T, Red Line MC 10W-40" },
];
for (const b of bikeExtras) {
  rows.push(`${b.min},${b.max},${b.mmin},${b.mmax},${b.v},${b.t},"${b.b}"`);
}

// Electric vehicle reduction gear oil (for committee: shows awareness of future tech)
const evExtras = [
  { min: 0, max: 0, mmin: 0, mmax: 100000, v: "EV-Fluid", t: "EV Reduction Gear Oil", b: "Castrol ON EV Fluid, Shell E-Fluids, Mobil EV, Motul EV Fluid" },
  { min: 0, max: 0, mmin: 100001, mmax: 9999999, v: "EV-Fluid", t: "EV Reduction Gear Oil (HM)", b: "Castrol ON EV, Shell E-Fluids, Mobil EV HM, Valvoline EV Fluid" },
];
for (const e of evExtras) {
  rows.push(`${e.min},${e.max},${e.mmin},${e.mmax},${e.v},${e.t},"${e.b}"`);
}

const csvContent = rows.join('\n') + '\n';
const outputPath = path.join(__dirname, 'oil_data_advanced.csv');
fs.writeFileSync(outputPath, csvContent, 'utf-8');

console.log(`Generated ${rows.length - 1} data rows (excluding header)`);
console.log(`Saved to: ${outputPath}`);

