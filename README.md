# 🚗 Auto-Care

Auto-Care is a comprehensive, full-stack e-commerce and maintenance platform designed for automotive enthusiasts and everyday drivers. It provides a seamless experience for buying auto parts, discovering local auto shops, and getting intelligent engine oil recommendations.

---

## ✨ Key Features

- **🛍️ Multi-Vendor Marketplace (Shops):** Sellers can create digital storefronts, manage product catalogs, and offer exclusive deals via promotional events.
- **🤖 ML-Powered Oil Recommendation Engine:** An intelligent system built natively in JavaScript using a **Random Forest Classifier**. It analyzes engine size, mileage, and vehicle type to predict optimal oil viscosity and type (with a confidence score) while providing localized maintenance advisories.
- **🛒 Complete E-Commerce Flow:** Features a unified shopping cart, secure checkout, payment gateway integration, order tracking, and a robust review system.
- **💳 Financial & Withdrawal Module:** Secure flow for sellers to request earnings withdrawals, fully moderated via the Admin dashboard.
- **🔐 Role-Based Access Control:** Distinct roles for regular Users, Sellers (Shop Owners), and Administrators, utilizing JWT-based authentication.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, TailwindCSS (Dynamic & Responsive UI)
- **Backend:** Node.js, Express.js (RESTful API architecture)
- **Database:** MongoDB (with Mongoose ORM)
- **Machine Learning:** `ml-random-forest` (Serverless-compatible pure JS implementation)
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Media Storage:** Cloudinary

---

## 🧠 About the ML Recommendation Engine

The oil recommendation engine has been upgraded from a traditional rule-based CSV lookup to a machine learning architecture:
1. **Data Expansion:** Transforms 150+ baseline data rows into thousands of synthetic data points for robust training.
2. **Algorithm:** Random Forest Classifier trained at server startup.
3. **Speed:** Achieves <50ms prediction latency.
4. **Features Considered:** Engine CC, Mileage, and Vehicle Type (One-hot encoded categories like CNG, Turbo, Hybrid, EV, Motorcycle).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abdullah-032s/Auto-Care.git
   cd Auto-Care
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend/` directory with your configuration:
   ```env
   PORT=8000
   DB_URL=your_mongodb_uri
   JWT_SECRET_KEY=your_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=your_stripe_key
   ```

5. **Run the Application:**
   Open two terminals.
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm start
   ```

---

## 👨‍💻 Authors & Contributors

- **Auto-Care Team** - FA22-BSE-032 & FA22-BSE-102
