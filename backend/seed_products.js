const mongoose = require("mongoose");
const Product = require("./model/product");
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

const productsData = [
  {
    name: "Michelin Pilot Sport 4S High Performance Tire",
    description: "Experience unparalleled grip and steering precision. The Michelin Pilot Sport 4S is a high-performance tire designed for sports cars, offering excellent wet and dry traction, shorter braking distances, and a long tread life for all conditions.",
    category: "Tires",
    discountPrice: 189,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Goodyear Wrangler Radial Tire",
    description: "Rugged off-road tire with superior grip on wet and dry surfaces. Perfect for SUVs and trucks.",
    category: "Tires",
    discountPrice: 180,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1535532581362-e67c870c538a?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Philips X-tremeVision Pro150 LED Headlight Kit",
    description: "Upgrade your nighttime visibility with these powerful LED headlights. They produce up to 150% more brightness, ensuring a safer drive in low-light conditions with a crisp white light that mimics daylight.",
    category: "Headlights",
    discountPrice: 69,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1549207107-2704df6b92ab?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Xenon HID Headlight Bulbs",
    description: "High-intensity discharge bulbs for maximum visibility at night.",
    category: "Headlights",
    discountPrice: 35,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "KW Variant 3 Coilover Suspension Kit",
    description: "Achieve the perfect balance of performance and aesthetics. The KW V3 allows independent adjustment of rebound and compression damping, providing custom ride height and unmatched handling dynamics.",
    category: "Suspension",
    discountPrice: 1299,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Premium Faux Leather Custom Fit Seat Covers",
    description: "Protect your original upholstery while giving your interior a luxurious upgrade. Water-resistant, stain-resistant, and tailored for a snug, OEM-like fit on most modern vehicles.",
    category: "Seat covers",
    discountPrice: 95,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1722773209231-054901d53a54?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "K&N High-Flow Air Filter (Washable & Reusable)",
    description: "Engineered to increase horsepower and acceleration. This washable and reusable high-flow filter provides superior filtration and is the last air filter your car will ever need.",
    category: "Filters",
    discountPrice: 52,
    stock: 120,
    imageUrl: "https://plus.unsplash.com/premium_photo-1693833841057-d753a32d6b8a?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Brembo Ceramic Brake Pad & Rotor Kit",
    description: "Experience superior stopping power with trusted braking technology. Low dust, low noise, and incredibly durable ceramic pads paired with vented rotors for optimal heat dissipation.",
    category: "Brakes",
    discountPrice: 275,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Castrol EDGE 5W-30 Advanced Full Synthetic Motor Oil",
    description: "Maximize your engine performance. Formulated with fluid titanium technology to withstand high pressure, reduce friction, and deliver superior protection for up to 10,000 miles.",
    category: "Oil,Fluids,Lubricants",
    discountPrice: 35,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1518112390430-f4ab02e9c2c8?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Brake Fluid DOT 4",
    description: "High-performance brake fluid for hydraulic brake systems.",
    category: "Oil,Fluids,Lubricants",
    discountPrice: 10,
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1518112390430-f4ab02e9c2c8?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "WeatherTech FloorLiners (Front & Rear Set)",
    description: "Absolute interior protection. These laser-measured, rigid core floor liners perfectly conform to your vehicle's footwells, trapping liquids and debris to keep your carpets looking brand new.",
    category: "Accessories",
    discountPrice: 165,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1759004593180-9da702aa12bb?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Smartphone Car Mount",
    description: "Secure and adjustable phone mount for dashboard or windshield.",
    category: "Accessories",
    discountPrice: 15,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60",
  }
];

const seedProducts = async () => {
  connectDatabase();
  
  try {
    let shop = await Shop.findOne({ email: "seller@example.com" });
    if (!shop) {
      console.log("Shop 'seller@example.com' not found. Creating a test shop...");
      shop = await Shop.create({
        name: "Test Seller",
        email: "seller@example.com",
        password: "password123", // Assuming some basic required fields
        address: "123 Test Street",
        phoneNumber: "1234567890",
        role: "Seller",
        zipCode: 12345,
        avatar: {
          public_id: "test",
          url: "https://images.unsplash.com/photo-1563714192622-4cb1a4fc541c?w=100&auto=format&fit=crop&q=60"
        }
      });
      console.log(`Created Shop: ${shop.name} (${shop._id})`);
    } else {
      console.log(`Found Shop: ${shop.name} (${shop._id})`);
    }

    for (const prod of productsData) {
      const newProduct = {
        name: prod.name,
        description: prod.description,
        category: prod.category,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        images: [
          {
            public_id: `seed_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            url: prod.imageUrl,
          },
        ],
        shopId: shop._id,
        shop: shop, // The Product model expects the full shop object
        originalPrice: prod.discountPrice * 1.2, // Fake original price
      };

      await Product.create(newProduct);
      console.log(`Created product: ${prod.name}`);
    }

    console.log("All products seeded successfully!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    process.exit();
  }
};

seedProducts();
