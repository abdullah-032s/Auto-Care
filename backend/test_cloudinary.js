require("dotenv").config({ path: "config/.env" });
const cloudinary = require("cloudinary");
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
    try {
        // Read the dummy model we already have or create a small fake file
        const porschePath = '../frontend/public/models/porsche.glb';
        if (!fs.existsSync(porschePath)) {
            console.log("No fallback model to upload");
            return;
        }

        console.log("Uploading porsche.glb to Cloudinary...");
        const result = await cloudinary.v2.uploader.upload(porschePath, {
            resource_type: "raw",
            folder: "models",
        });
        console.log("Success! Cloudinary URL:", result.secure_url);

        // Clean it up immediately
        await cloudinary.v2.uploader.destroy(result.public_id, { resource_type: "raw" });
        console.log("Cleaned up test file.");
    } catch (error) {
        console.error("Cloudinary Error:", error);
    }
}

testUpload();
