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
  // Tires
  {
    name: "Michelin Defender T+H All-Season Tire",
    description: "Long-lasting, all-season tire designed for passenger cars and minivans. Offers excellent traction and a quiet ride.",
    category: "Tires",
    discountPrice: 150,
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
    name: "Bridgestone Blizzak WS90 Winter Tire",
    description: "Top-rated winter tire providing exceptional control on snow and ice.",
    category: "Tires",
    discountPrice: 160,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1583257523533-5c74384d081f?w=600&auto=format&fit=crop&q=60",
  },

  // Headlights
  {
    name: "LED Headlight Conversion Kit",
    description: "Super bright LED headlights, 6000K cool white. Easy plug-and-play installation.",
    category: "Headlights",
    discountPrice: 45,
    stock: 100,
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

  // Suspension
  {
    name: "Performance Coilover Kit",
    description: "Adjustable coilover suspension for improved handling and lowered stance.",
    category: "Suspension",
    discountPrice: 650,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1669136048337-5daa3adef7b2?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Heavy Duty Shock Absorbers",
    description: "Durable shock absorbers designed for rough terrain and heavy loads.",
    category: "Suspension",
    discountPrice: 120,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format&fit=crop&q=60",
  },

  // Seat covers
  {
    name: "Leather Car Seat Covers",
    description: "Premium leather seat covers, waterproof and durable. Universal fit.",
    category: "Seat covers",
    discountPrice: 85,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1722773209231-054901d53a54?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Sporty Mesh Seat Covers",
    description: "Breathable mesh fabric, cool in summer. Adds a sporty look to your interior.",
    category: "Seat covers",
    discountPrice: 40,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?w=600&auto=format&fit=crop&q=60",
  },

  // Filters
  {
    name: "High-Flow Air Filter",
    description: "Reusable high-flow air filter. Increases horsepower and acceleration.",
    category: "Filters",
    discountPrice: 55,
    stock: 75,
    imageUrl: "https://plus.unsplash.com/premium_photo-1693833841057-d753a32d6b8a?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Premium Oil Filter",
    description: "Removes contaminants to protect your engine. Recommended for synthetic oils.",
    category: "Filters",
    discountPrice: 12,
    stock: 200,
    imageUrl: "https://images.unsplash.com/photo-1626127324838-89c52efb479d?w=600&auto=format&fit=crop&q=60",
  },

  // Brakes
  {
    name: "Ceramic Brake Pads",
    description: "Low dust, noise-free braking performance. Long service life.",
    category: "Brakes",
    discountPrice: 45,
    stock: 90,
    imageUrl: "https://images.unsplash.com/photo-1696494561430-de087dd0bd69?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Drilled and Slotted Rotors",
    description: "Performance brake rotors for better heat dissipation and stopping power.",
    category: "Brakes",
    discountPrice: 110,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&auto=format&fit=crop&q=60",
  },

  // Oil, Fluids, Lubricants
  {
    name: "Full Synthetic Motor Oil 5W-30",
    description: "Advanced full synthetic formula for superior engine protection.",
    category: "Oil, Fluids, Lubricants",
    discountPrice: 35,
    stock: 150,
    imageUrl: "https://media.istockphoto.com/id/2172594067/photo-1727893119356-1702fe921cf9?q=80&w=2050&auto=format&fit=crop",
  },
  {
    name: "Brake Fluid DOT 4",
    description: "High-performance brake fluid for hydraulic brake systems.",
    category: "Oil, Fluids, Lubricants",
    discountPrice: 10,
    stock: 120,
    imageUrl: "https://images.unsplash.com/photo-1518112390430-f4ab02e9c2c8?w=600&auto=format&fit=crop&q=60",
  },

  // Accessories
  {
    name: "Car Interior Organizer",
    description: "Keep your car tidy with this multi-pocket organizer.",
    category: "Accessories",
    discountPrice: 20,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1759004593180-9da702aa12bb?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Smartphone Car Mount",
    description: "Secure and adjustable phone mount for dashboard or windshield.",
    category: "Accessories",
    discountPrice: 15,
    stock: 150,
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60",
  },
  {
    name: "Steering Wheel Cover",
    description: "Comfortable grip steering wheel cover, anti-slip.",
    category: "Accessories",
    discountPrice: 18,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=600&auto=format&fit=crop&q=60",
  }
];

const seedProducts = async () => {
  connectDatabase();
  
  try {
    const shop = await Shop.findOne({ email: "seller@example.com" });
    if (!shop) {
      console.log("Shop 'seller@example.com' not found. Please create it first.");
      process.exit(1);
    }

    console.log(`Found Shop: ${shop.name} (${shop._id})`);

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
