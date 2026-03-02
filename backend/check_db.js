const mongoose = require("mongoose");
const Shop = require("./model/shop");

mongoose.connect("mongodb://127.0.0.1:27017/auto-care", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    const shops = await Shop.find({});
    for (const shop of shops) {
        console.log(`Shop: ${shop.name} | Supported Models count: ${shop.supportedModels ? shop.supportedModels.length : 0}`);
        if (shop.supportedModels && shop.supportedModels.length > 0) {
            console.log(shop.supportedModels);
        }
    }
    process.exit(0);
});
