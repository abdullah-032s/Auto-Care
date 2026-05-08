const mongoose = require("mongoose");
const Shop = require("./model/shop");
require("dotenv").config({ path: "config/.env" });

const connectDatabase = async () => {
  try {
    console.log("Connecting to:", process.env.DB_URL);
    const data = await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Mongodb connected with server: ${data.connection.host}`);
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

const listShops = async () => {
  await connectDatabase();
  const shops = await Shop.find({});
  console.log("Shops found:", shops.length);
  shops.forEach(s => console.log(`ID: ${s._id}, Name: ${s.name}, Email: ${s.email}`));
  process.exit();
};

listShops();
