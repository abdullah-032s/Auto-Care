const app = require("../app");
const connectDatabase = require("../db/Database");
const cloudinary = require("cloudinary");
const path = require("path");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: path.resolve(__dirname, "../config/.env"),
    });
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cache the database connection promise for serverless reuse
let dbConnectionPromise = null;

function ensureDbConnection() {
    if (!dbConnectionPromise) {
        dbConnectionPromise = connectDatabase();
    }
    return dbConnectionPromise;
}

// Vercel serverless handler: wait for DB before handling request
module.exports = async (req, res) => {
    try {
        await ensureDbConnection();
    } catch (err) {
        console.error("DB connection failed:", err.message);
    }
    return app(req, res);
};
