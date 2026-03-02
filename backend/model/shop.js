const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your shop email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password should be greater than 6 characters"],
    select: false,
  },
  status: {
    type: String,
    enum: ["Under Observation", "Approved", "Rejected"],
    default: "Under Observation",
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "Seller",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  zipCode: {
    type: Number,
    required: true,
  },
  withdrawMethod: {
    type: Object,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  transections: [
    {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "Processing",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      updatedAt: {
        type: Date,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
  paintServiceStatus: {
    type: String,
    enum: ["available", "unavailable"],
    default: "unavailable",
  },
  supportedModels: {
    type: [
      {
        modelName: {
          type: String,
        },
        price: {
          type: Number,
        },
        modelUrl: {
          type: String, // Can store base64 string during upload, and Cloudinary URL afterwards
        }
      },
    ],
    default: [
      { modelName: "Toyota Supra", price: 400 },
      { modelName: "Honda Civic", price: 200 },
      { modelName: "Hyundai Tucson", price: 300 },
    ],
  },
});

// Hash password
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// comapre password
shopSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Shop", shopSchema);
