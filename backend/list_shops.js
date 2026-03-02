const mongoose = require("mongoose");
const Shop = require("./model/shop");
require("dotenv").config({ path: "config/.env" });

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

const listShops = async () => {
  connectDatabase();
  const shops = await Shop.find({});
  console.log("Shops found:", shops.length);
  shops.forEach(s => console.log(`ID: ${s._id}, Name: ${s.name}, Email: ${s.email}`));
  process.exit();
};

listShops();
