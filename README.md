# AutoCare - Automotive E-Commerce Platform

AutoCare is a comprehensive multi-vendor e-commerce platform designed specifically for the automotive industry. It connects car owners with sellers of auto parts, accessories, and services, providing a seamless shopping experience with advanced features like oil recommendations, event management, and real-time communication.

## 🚀 Live Demo
- **Frontend:** [https://frontend-phi-rouge-27.vercel.app](https://frontend-phi-rouge-27.vercel.app)
- **Backend API:** [https://backend-phi-sand-87.vercel.app](https://backend-phi-sand-87.vercel.app)
- **Socket Server:** [https://socket-flax.vercel.app](https://socket-flax.vercel.app)

## 🛠 Tools & Technologies

### **Frontend**
- **React.js:** Component-based UI library for building interactive interfaces.
- **Redux Toolkit:** State management for handling user sessions, cart, products, and more.
- **Tailwind CSS:** Utility-first CSS framework for rapid and responsive UI design.
- **Material UI (MUI):** Pre-built React components for data grids, icons, and layout.
- **Axios:** Promise-based HTTP client for API requests.
- **React Router DOM:** Client-side routing for navigation.
- **Socket.io Client:** Real-time communication for the chat system.
- **React Toastify:** For elegant notification popups.
- **Stripe.js:** Secure payment processing integration.

### **Backend**
- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework for building robust APIs.
- **MongoDB & Mongoose:** NoSQL database and ODM for flexible data modeling.
- **JWT (JSON Web Tokens):** Secure authentication and authorization.
- **Cloudinary:** Cloud-based image management and optimization.
- **Nodemailer:** Email service for account activation and notifications.
- **Stripe API:** Backend integration for payment intent and processing.
- **Multer:** Middleware for handling `multipart/form-data` (file uploads).

### **Development & Deployment**
- **Vercel:** Hosting platform for both frontend and backend.
- **Nodemon:** Development utility for auto-restarting the server.
- **Postman:** API testing and documentation.
- **Git & GitHub:** Version control and collaboration.

## ✨ Key Functionalities

### **1. User & Seller Authentication**
- **Secure Registration:** Email verification via Nodemailer.
- **Login System:** JWT-based persistent sessions with cookies.
- **Role-Based Access:** Distinct dashboards for Customers, Sellers, and Admins.
- **Password Management:** Secure password reset flows.

### **2. Product Management**
- **Create & Edit:** Sellers can add detailed product listings with images (hosted on Cloudinary), descriptions, stock, and pricing.
- **Categories:** Specialized categories like Tires, Headlights, Suspension, Filters, Brakes, and Lubricants.
- **Search & Filter:** Advanced search capabilities to find parts by name or category.
- **Reviews:** Customers can rate and review purchased products.

### **3. Smart Oil Recommendation Engine**
- **Custom Logic:** A specialized feature that recommends the perfect engine oil based on:
    - **Engine CC:** The engine capacity.
    - **Mileage:** The total distance driven.
- **Data-Driven:** Uses a backend algorithm (Node.js) to match inputs against a comprehensive database of oil specifications (Viscosity, Type, Brands).

### **4. Order & Payment System**
- **Shopping Cart:** Persistent cart management.
- **Checkout:** Integrated Stripe payment gateway for secure transactions.
- **Order Tracking:** Real-time status updates (Processing, Shipped, Delivered).
- **Refunds:** Automated refund request and processing system.

### **5. Seller Dashboard**
- **Analytics:** Visual overview of sales, orders, and products.
- **Event Management:** Create time-limited sales events and promotions.
- **Coupons:** Generate discount codes for marketing campaigns.
- **Withdrawals:** Manage earnings and request payouts.

- **Dedicated Coupons Page:** A central hub showing all active and available coupons on the platform.

### **6. Real-Time Communication**
- **Inbox System:** Built-in chat functionality allowing customers to ask sellers questions directly before purchasing.
- **Socket.io:** Ensures instant message delivery.

### **7. Admin Dashboard**
- **User Management:** View and manage all registered users.
- **Shop Requests:** Approve or reject new seller applications.
- **Platform Oversight:** Monitor platform-wide activities and transactions.

### **8. Future Enhancements**
- **Interactive 3D Paint Service:** Planned feature allowing customers to explore compatible 3D car models and select paint colors and finishes in real-time. Sellers will be able to upload custom `.glb`/`.gltf` models and offer paint job services with auto-calculated pricing.
- **AI-Based Oil Recommendation:** Upgrade the current heuristic oil matching engine to a Machine Learning model trained on real-world vehicle data.
- **Mobile Application:** Native iOS and Android apps built with React Native.

## 📂 Project Structure

```
auto-Care/
├── backend/                # Node.js & Express API
│   ├── config/             # Environment variables & DB connection
│   ├── controller/         # Request handlers (Product, Order, User, etc.)
│   ├── model/              # Mongoose Schemas
│   ├── middleware/         # Auth, Error handling, File uploads
│   ├── routes/             # API Route definitions
│   └── utils/              # Helper functions (JWT, Email, ErrorHandler)
│
└── frontend/               # React.js Application
    ├── public/             # Static assets
    └── src/
        ├── components/     # Reusable UI components
        ├── pages/          # Full page views
        ├── redux/          # State slices and store configuration
        ├── styles/         # Global styles and Tailwind config
        └── static/         # Static data files
```

## 🔧 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/devwithdaisy/Auto-Care.git
    cd auto-Care
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a config/.env file with your credentials (DB_URL, JWT_SECRET, CLOUDINARY, STRIPE, etc.)
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm start
    ```

## 🤝 Contribution
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
