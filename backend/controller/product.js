const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

const path = require('path');
const fs = require('fs');
const { oilMLModel } = require('../ml/oilModel');

// Train the ML model once at startup
const CSV_PATH = path.join(__dirname, 'oil_data_advanced.csv');
try {
  oilMLModel.train(CSV_PATH);
} catch (e) {
  console.error('[OilML] Training failed:', e.message);
}

router.post('/oil-recommendations', async (req, res) => {
  try {
    const { engineCC, mileage, vehicleType } = req.body;
    const cc = parseInt(engineCC);
    const m = parseInt(mileage);

    if (isNaN(cc) || isNaN(m)) {
      return res.status(400).json({ error: "Arguments must be integers" });
    }
    if (!oilMLModel.trained) {
      return res.status(503).json({ error: "ML model not ready yet. Please try again shortly." });
    }

    const vt = vehicleType || 'standard';
    const { viscosity, oil_type, confidence, brands } = oilMLModel.predict(cc, m, vt);
    const oilStr = `${viscosity} ${oil_type}`;

    // Oil change interval
    let changeInterval = {};
    if (oil_type.includes("Fully Synthetic") || oil_type.includes("EV")) {
      changeInterval = { km: "8,000 – 10,000 km", months: "Every 6 months" };
    } else if (oil_type.includes("Synthetic Blend")) {
      changeInterval = { km: "5,000 – 7,500 km", months: "Every 4–5 months" };
    } else if (oil_type.includes("Mineral")) {
      changeInterval = { km: "3,000 – 5,000 km", months: "Every 3 months" };
    } else {
      changeInterval = { km: "4,000 – 6,000 km", months: "Every 4 months" };
    }
    if (vt === 'hot_climate') {
      changeInterval.km = "4,000 – 6,000 km"; changeInterval.months = "Every 3–4 months";
      changeInterval.note = "Extreme heat degrades oil faster.";
    } else if (vt === 'cng') {
      changeInterval.km = "3,000 – 5,000 km"; changeInterval.months = "Every 3 months";
      changeInterval.note = "CNG burns hotter, causing faster oil degradation.";
    } else if (vt === 'turbo') {
      changeInterval.note = "Turbo engines put extra thermal stress on oil.";
    }

    // API specification
    let apiSpec;
    if (oil_type.includes("Motorcycle"))           apiSpec = "JASO MA2 / API SN";
    else if (oil_type.includes("EV"))              apiSpec = "OEM Specific (check manual)";
    else if (cc > 4000)                            apiSpec = "API CK-4 / CI-4 (Diesel)";
    else if (oil_type.includes("Fully Synthetic")) apiSpec = "API SP / SN Plus";
    else if (oil_type.includes("Synthetic Blend")) apiSpec = "API SN / SM";
    else                                           apiSpec = "API SN / SL";

    // Oil capacity
    let capacity;
    if (vt === 'motorcycle') capacity = cc <= 150 ? "0.8 – 1.0 L" : cc <= 400 ? "1.5 – 2.5 L" : "3.0 – 4.0 L";
    else if (vt === 'ev')    capacity = "Check EV manual";
    else if (cc <= 800)      capacity = "2.5 – 3.0 L";
    else if (cc <= 1300)     capacity = "3.0 – 3.5 L";
    else if (cc <= 1800)     capacity = "3.5 – 4.0 L";
    else if (cc <= 2500)     capacity = "4.0 – 5.0 L";
    else if (cc <= 4000)     capacity = "5.0 – 7.0 L";
    else                     capacity = "7.0 – 10.0 L";

    // Compatible cars (Pakistan market)
    let compatibleCars = [];
    if (vt === 'motorcycle') {
      if (cc <= 110)      compatibleCars = ["Honda CD70","Honda CG125","Yamaha YBR125","Suzuki GD110"];
      else if (cc <= 200) compatibleCars = ["Honda CB150F","Yamaha YBR150","Suzuki GR150","Benelli TNT150"];
      else if (cc <= 400) compatibleCars = ["Honda CB300R","Yamaha MT-03","KTM Duke 390"];
      else                compatibleCars = ["Kawasaki Ninja 650","Honda CBR600","Suzuki GSX-R750"];
    } else if (vt === 'ev') {
      compatibleCars = ["MG ZS EV","Audi e-tron","BYD Atto 3","Tesla Model 3"];
    } else {
      if (cc <= 660)       compatibleCars = ["Suzuki Alto","Suzuki Mehran","Daihatsu Mira","FAW XPV"];
      else if (cc <= 1000) compatibleCars = ["Suzuki Wagon R","Suzuki Cultus","KIA Picanto","Prince Pearl"];
      else if (cc <= 1300) compatibleCars = ["Toyota Corolla XLi","Suzuki Swift","Toyota Vitz","Honda Fit"];
      else if (cc <= 1500) compatibleCars = ["Honda City","Toyota Yaris","Hyundai Accent","MG ZS"];
      else if (cc <= 1800) compatibleCars = ["Toyota Corolla Altis","Honda Civic","Hyundai Elantra","Changan Alsvin"];
      else if (cc <= 2500) compatibleCars = ["Kia Sportage","Hyundai Tucson","Toyota RAV4","Honda CR-V"];
      else if (cc <= 3500) compatibleCars = ["Toyota Fortuner","Toyota Prado","Mitsubishi Pajero","Isuzu MU-X"];
      else if (cc <= 5000) compatibleCars = ["Toyota Land Cruiser","Nissan Patrol","Toyota Hilux"];
      else                 compatibleCars = ["Hino Trucks","UD Trucks","Isuzu NQR","FAW Trucks"];
    }

    // Reason (ML-powered explanation)
    let reason;
    if (oil_type.includes("Fully Synthetic"))
      reason = `The ML engine analysed your ${cc}cc engine with ${m.toLocaleString()} km mileage and recommends Fully Synthetic ${viscosity} for maximum thermal stability and cold-start protection.`;
    else if (oil_type.includes("Synthetic Blend"))
      reason = `Synthetic Blend ${viscosity} is predicted for your ${cc}cc engine — optimal balance of protection and cost at your mileage level.`;
    else if (oil_type.includes("High Mileage"))
      reason = `High Mileage ${viscosity} is recommended for your engine's age — it contains seal conditioners to prevent leaks and reduce oil consumption.`;
    else if (oil_type.includes("Mineral"))
      reason = `Mineral ${viscosity} provides reliable lubrication for your smaller engine at an economical price.`;
    else if (oil_type.includes("EV"))
      reason = `EV reduction gear fluid is required for your electric drivetrain. No conventional engine oil is needed.`;
    else
      reason = `${viscosity} ${oil_type} is the ML-predicted optimum for your vehicle profile.`;

    // Advisories & tips
    let specialAdvisories = [], maintenanceTips = [];
    if (vt === 'ev') {
      specialAdvisories = ["⚠️ EVs do not use traditional engine oil — this is for reduction gear fluid.","⚡ Only certified EV technicians should service the drivetrain."];
      maintenanceTips   = ["Check battery coolant every 10,000 km.","Inspect brake fluid every 2 years.","Keep tires properly inflated to maximise range."];
    } else if (vt === 'cng') {
      specialAdvisories = ["🔥 CNG runs hotter than petrol — oil oxidises faster.","🛑 Occasionally run on petrol to lubricate upper cylinder components."];
      maintenanceTips   = ["Use CNG-specific spark plugs.","Check air filter frequently.","Never exceed 5,000 km oil change interval."];
    } else if (vt === 'hybrid') {
      specialAdvisories = ["🔋 Hybrid engines stop/start frequently, causing moisture buildup in oil.","💧 Low viscosity oil is critical for fast warm-up cycles."];
      maintenanceTips   = ["Use 0W-20 or manufacturer's lowest approved viscosity.","Check hybrid battery cooling fan filters every 15,000 km.","Inspect brake fluid moisture yearly."];
    } else if (vt === 'motorcycle') {
      specialAdvisories = ["🏍️ Motorcycles share oil for engine, transmission, and wet clutch.","🚫 Never use car oil — friction modifiers cause clutch slip."];
      maintenanceTips   = ["Clean and lube the drive chain every 500 km.","Check tire pressure weekly.","Warm up engine 30–60 sec before riding."];
    } else if (vt === 'turbo') {
      specialAdvisories = ["🌪️ Turbochargers spin at 100,000+ RPM and depend entirely on engine oil.","🔥 Thermal breakdown can destroy a turbo in seconds."];
      maintenanceTips   = ["Idle 30–60 sec before shutdown to cool the turbo.","Use only Fully Synthetic to resist coking and sludge."];
    } else if (vt === 'hot_climate') {
      specialAdvisories = ["☀️ 40°C+ ambient temps thin engine oil, reducing the protective film thickness."];
      maintenanceTips   = ["Check coolant/antifreeze monthly. Never use plain water.","Park in the shade when possible."];
    } else if (vt === 'cold_start') {
      specialAdvisories = ["❄️ Most engine wear occurs during cold starts. Low 'W' viscosity is critical."];
      maintenanceTips   = ["Don't rev immediately after starting — give oil 30 sec to circulate.","Keep battery fully charged; cold reduces cranking amps."];
    } else {
      specialAdvisories = ["✅ Regular maintenance is the key to engine longevity."];
      maintenanceTips   = ["Check oil dipstick monthly on a cold engine.","Replace oil filter at every oil change.","Rotate tires every 10,000 km."];
    }

    return res.json({
      recommended_oil:    [oilStr],
      brand_names:        brands,
      match_type:         "ml_prediction",
      ml_confidence:      parseFloat(confidence.toFixed(2)),
      change_interval:    changeInterval,
      api_spec:           apiSpec,
      oil_capacity:       capacity,
      compatible_cars:    compatibleCars,
      reason,
      special_advisories: specialAdvisories,
      maintenance_tips:   maintenanceTips,
    });

  } catch (error) {
    console.error("Error generating ML recommendation:", error);
    return res.status(500).json({ error: String(error) });
  }
});


// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
      
        const imagesLinks = [];
      
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      
        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }    

      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }
    
      await Product.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
