const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

// create shop
router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    let avatarData;
    if (req.body.avatar) {
      try {
        const uploaded = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
        });
        avatarData = {
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        };
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        const initialsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          req.body.name || "Seller"
        )}&background=random`;
        avatarData = {
          public_id: "default",
          url: initialsUrl,
        };
      }
    } else {
      const initialsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        req.body.name || "Seller"
      )}&background=random`;
      avatarData = {
        public_id: "default",
        url: initialsUrl,
      };
    }


    const seller = {
      name: req.body.name,
      email: email,
      password: req.body.password,
      avatar: avatarData,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    const activationToken = createActivationToken(seller);

    const frontendUrl =
      process.env.FRONTEND_URL ||
      (process.env.NODE_ENV === "PRODUCTION"
        ? "https://auto-care-frontend.vercel.app"
        : "http://localhost:3000");
    const activationUrl = `${frontendUrl}/seller/activation/${activationToken}`;

    if (process.env.SKIP_EMAIL_ACTIVATION === "true") {
      const created = await Shop.create({
        name: seller.name,
        email: seller.email,
        password: seller.password,
        avatar: seller.avatar,
        address: seller.address,
        phoneNumber: seller.phoneNumber,
        zipCode: seller.zipCode,
      });
      return sendShopToken(created, 201, res);
    }

    console.log("Seller Activation URL: ", activationUrl);
    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
    } catch (error) {
      // Continue in dev environments even if email fails
    }

    res.status(201).json({
      success: true,
      message: `please check your email:- ${seller.email} to activate your shop!`,
      activationToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
}));

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



// update shop status ---admin
router.put(
  "/update-shop-status/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {

    try {
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(
          new ErrorHandler("Shop is not available with this id", 400)
        );
      }

      const { newStatus } = req.body;

      // Assuming that 'newStatus' is a valid status value
      shop.status = newStatus;
      await shop.save();

      res.status(201).json({
        success: true,
        message: "Shop status updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      user.password = undefined;

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const isProd = process.env.NODE_ENV === "PRODUCTION";
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// get all shops with active paint service --- public
router.get(
  "/get-paint-shops",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shops = await Shop.find({ paintServiceStatus: "available" }).sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        shops,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };


      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode, supportedModels } = req.body;

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      if (supportedModels) {
        // Handle Cloudinary upload for any new 3D model base64 strings
        const updatedModels = [];
        for (const model of supportedModels) {
          if (model.modelUrl && model.modelUrl.startsWith("data:")) {
            // This is a new base64 upload
            try {
              const result = await cloudinary.v2.uploader.upload(model.modelUrl, {
                resource_type: "raw",
                folder: "models",
              });
              model.modelUrl = result.secure_url;
            } catch (err) {
              console.error("Cloudinary 3D Model Upload Error:", err);
              // Fallback to null if upload fails so we don't store massive base64 in DB
              model.modelUrl = null;
            }
          }
          updatedModels.push(model);
        }
        shop.supportedModels = updatedModels;
      }

      await shop.save();

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update paint service status
router.put(
  "/update-paint-service",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { paintServiceStatus } = req.body;
      const shop = await Shop.findByIdAndUpdate(req.seller._id, { paintServiceStatus }, { new: true });
      res.status(201).json({ success: true, shop });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller paint service status
router.put(
  "/update-paint-service",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { paintServiceStatus } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        paintServiceStatus,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
