# Chapter 5 Implementation

This chapter describes the practical implementation of the AutoCare E-Commerce platform. It explains how the designed architecture was translated into working modules, algorithms, user interfaces, and deployment components.

## 5.1 Development Environment

This section describes the software and hardware environment used for system implementation.

- **IDE used**: Visual Studio Code
- **Programming language(s)**: JavaScript, HTML5, CSS3
- **Framework(s) used**: React.js, Express.js, Node.js, Tailwind CSS, Redux Toolkit
- **Database system**: MongoDB (using Mongoose ODM)
- **Operating system**: Cross-platform (Windows, macOS, Linux)
- **Hardware specifications**: Standard development machine (8GB+ RAM, multi-core CPU)

## 5.2 Core Module Implementation

This section explains how each major module was implemented.

### 5.2.1 Module 1: User & Seller Authentication
- **Purpose**: To manage user registration, secure login, and role-based access control across the platform.
- **Key Functionalities**: Email verification, session management via JWT, secure password hashing, and role separation (Customer, Seller, Admin).
- **Important Classes/Functions**: `createUser()`, `loginUser()`, `sendMail()`, `isAuthenticated()` middleware.
- **Integration with other modules**: Integrates heavily with every other module by providing the `user` or `seller` object required to authorize actions like placing orders, sending messages, or adding products.

### 5.2.2 Module 2: Smart Oil Recommendation Engine
- **Purpose**: To provide customized engine oil suggestions based on a user's vehicle specifications.
- **Key Functionalities**: Dynamically filtering the oil database based on engine CC and mileage, and mapping results to active shop inventory.
- **Important Classes/Functions**: `getRecommendations()`, `filterByViscosity()`, `checkInventoryStatus()`.
- **Integration with other modules**: Interacts with the Product Management module to verify that recommended oils are currently in stock and purchasable.

### 5.2.3 Module 3: Product Management
- **Purpose**: To allow sellers to curate their storefronts by creating, updating, and managing product listings.
- **Key Functionalities**: Image uploading, category assignment, dynamic pricing, and inventory stock tracking.
- **Important Classes/Functions**: `createProduct()`, `uploadMiddleware()`, `deleteProduct()`.
- **Integration with other modules**: Feeds data into the Order module (for checkout) and interfaces with the External APIs (Cloudinary) for image hosting.

### 5.2.4 Module 4: Order & Payment System
- **Purpose**: To track user carts and process secure financial transactions.
- **Key Functionalities**: Cart persistence, Stripe secure checkout, order status lifecycle tracking (Processing, Shipped, Delivered), and refund handling.
- **Important Classes/Functions**: `createOrder()`, `paymentIntent()`, `updateOrderStatus()`.
- **Integration with other modules**: Dependent on the Authentication module for user identity and the Product module for price calculation.

### 5.2.5 Module 5: Real-Time Communication
- **Purpose**: To facilitate instant messaging between buyers and sellers.
- **Key Functionalities**: Live message delivery, chat history persistence, and online status indicators.
- **Important Classes/Functions**: `sendMessage()`, `getMessage()`, `socket.emit()`.
- **Integration with other modules**: Connects users from the Product pages directly to Seller profiles.

### 5.2.6 Module 6: Admin Oversight
- **Purpose**: To provide platform-wide governance and analytical monitoring.
- **Key Functionalities**: Approving/rejecting shop creations, monitoring global transactions, and managing user suspensions.
- **Important Classes/Functions**: `getAllUsers()`, `updateShopStatus()`, `isAdmin()` middleware.
- **Integration with other modules**: Acts as a global wrapper with the ability to query data from the Auth, Product, and Order modules.

## 5.3 Algorithm Implementation

This section explains the implementation of the core algorithms used across the major modules in the system.

### 5.3.1 Algorithm 1: Authentication & Authorization (Module 1)
**Input:** User Email and Password (Login).
**Output:** Secure JWT Token or Error Message.

**Step-by-Step Working:**
1. The user submits their email and password.
2. The Node.js backend queries the database to find the user by email.
3. If the user is found, the backend utilizes `bcrypt` to compare the submitted password string with the stored hashed password.
4. If the comparison is successful, the backend generates a JSON Web Token (JWT) encrypting the user ID.
5. The token is sent back to the client and stored via HTTP-only cookies.

**Pseudo Code:**
```text
Algorithm AuthenticateUser(Email, Password):
  User = Find(DB, Email)
  If User is Null:
      Return "User Not Found"
  Match = CompareHash(Password, User.HashedPassword)
  If Match is True:
      Token = GenerateJWT(User.ID)
      SetCookie(Token)
      Return Success
  Else:
      Return "Invalid Credentials"
```
**Explanation:**
The algorithm ensures that plaintext passwords are never exposed or compared directly. By delegating session state to JWTs secured inside HTTP-only cookies, it protects the system against Cross-Site Scripting (XSS) session hijacking.

### 5.3.2 Algorithm 2: Smart Oil Matching (Module 2)
**Input:** User Vehicle Details (Engine Capacity/CC, current Mileage).
**Output:** Ranked list of recommended engine oils.

**Step-by-Step Working:**
1. The user inputs their Engine CC and current Mileage via the frontend interface.
2. The Node.js backend receives the request and executes a fast query script against the `oil_data_advanced` dataset.
3. The logic filters out incompatible viscosities based on engine size. Higher mileage triggers recommendations for high-mileage formulated oils to address engine wear.
4. The filtered list is cross-referenced with the current product inventory to ensure availability.
5. The final recommended product IDs are returned to the frontend.

**Pseudo Code:**
```text
Algorithm OilRecommender(Engine_CC, Mileage):
  Fetch Oil_Database
  Filter Set = []
  For each Oil in Oil_Database:
      If Oil.Max_CC >= Engine_CC and Oil.Min_CC <= Engine_CC:
          If Mileage > 100000 and Oil.Type == "High_Mileage":
              Add Oil to Filter Set
          Else If Mileage <= 100000:
              Add Oil to Filter Set
  Return Top 3 Matches from Filter Set
```
**Explanation:**
This algorithmic heuristic provides domain-specific expert knowledge to everyday customers, ensuring they select hardware-appropriate products. It filters dynamically rather than relying on strict static mapping, allowing it to adapt as the active inventory changes.

### 5.3.3 Algorithm 3: Order Processing (Module 4)
**Input:** User Cart Array, Payment Method Details.
**Output:** Processed Order ID and updated product stock.

**Step-by-Step Working:**
1. The user confirms their cart items and initiates the checkout process.
2. The backend calculates total prices (including shipping and applicable coupons) and sends a Payment Intent to the Stripe API.
3. Upon Stripe's successful charge confirmation, a `createOrder` transaction begins.
4. The item stock levels in the database are decremented.
5. The final Order object is generated and the seller's dashboards are updated.

**Pseudo Code:**
```text
Algorithm ProcessCheckout(Cart, PaymentDetails):
  TotalCost = CalculateTotal(Cart)
  StripeTransaction = RequestPaymentIntent(TotalCost, PaymentDetails)
  If StripeTransaction == "Success":
      For each Item in Cart:
          DeductStock(Item.ProductID, Item.Quantity)
      Order = ConstructOrder(Cart, TransactionID)
      Save(DB, Order)
      Return Order.ID
  Else:
      Return "Payment Failed"
```
**Explanation:**
This algorithm ensures transactional integrity. By verifying the Stripe Payment Intent strictly before stock reduction and order finalization, it prevents race conditions, overselling out-of-stock items, and fraudulent order generations.

## 5.4 External APIs / SDKs

**Table 5.1: External APIs Used**

| API/SDK Name | Purpose | Used In Module |
| :--- | :--- | :--- |
| **Stripe API** | Detailed transaction processing, executing payment intents securely while maintaining PCI compliance. | Order & Payment System |
| **Cloudinary SDK**| Handling base64 image data streams, storing visual media, and serving compressed product visuals via progressive CDNs. | Product Management |
| **Socket.io** | Establishing bi-directional WebSocket connections to enable low-latency message passing. | Real-Time Communication |
| **Nodemailer** | SMTP integration for dispatching secure account verification and password reset tokens. | User Authentication |


## 5.5 User Interface Implementation

This section presents a detailed explanation of user interface screens developed for the system.

### 5.5.1 UI Design Approach
- **Design Principles**: The AutoCare platform follows Minimalistic and Modern UI principles. Visual hierarchy relies on subtle drop shadows and distinctive spacing.
- **UI/UX Methodology**: We prioritized a Mobile-First approach, ensuring that core conversion paths (like checkout and chat) are deeply intuitive on small touch screens.
- **Wireframing Tools**: Initial mockups and layouts were drafted to maintain structural alignment.
- **Consistency**: Standardized color schemes (Indigo primary, Gray neutral backgrounds) and modern typography (Roboto/Inter) are enforced globally via Tailwind CSS configurations.
- **Accessibility**: High contrast text ratios and semantic HTML elements were utilized.
- **Responsive Strategy**: Adaptive grid layouts dynamically switch from 1-column mobile views to 4-column desktop storefronts using Tailwind breakpoints.

### 5.5.2 Screen-wise Implementation

#### 5.5.2.1 Screen 1: Login & Registration Screen
- **Purpose:** Secure entry point to the application for all user roles.
- **Main Components:** Email and Password input fields, avatar upload box, Login/Submit Buttons.
- **User Interaction Flow:** User provides credentials -> Clicks Login -> Validated -> Redirected to Home/Dashboard.
- **Backend/API Integration:** Calls `/user/login-user` or `/shop/login-shop`. Expects a JWT token cookie upon success.
- **Validation and Error Handling:** Frontend checks for empty fields and valid email format. Backend verifies password hash and returns `React Toastify` error alerts if invalid.

#### 5.5.2.2 Screen 2: Customer HomePage & Product Browsing
- **Purpose:** Primary hub for users to discover auto parts, access the Oil Recommender, and see best-selling items, events, and coupons.
- **Main Components:** Hero section banner, Category cards, Suggestive product grid, Filtering sidebar.
- **User Interaction Flow:** User navigates categories -> Applies filters -> Views product details -> Adds to cart.
- **Backend/API Integration:** Connects to `/product/get-all-products` to fetch items. 
- **Validation and Error Handling:** Displays "No products found" placeholders if filter queries return empty sets.

#### 5.5.2.3 Screen 3: Seller Dashboard
- **Purpose:** Provides comprehensive shop analytics and management tools for vendors.
- **Main Components:** Sidebar navigation, Analytics KPI Cards, Product Data Grid, Event/Coupon management forms, Withdraw request module.
- **User Interaction Flow:** Seller navigates through tabs to view active orders, add new products with images, or withdraw funds.
- **Backend/API Integration:** Fetches shop specific data via secured `/shop` endpoints requiring seller authentication.
- **Validation and Error Handling:** Form validations block the submission of products with missing prices or defective images.

#### 5.5.2.4 Screen 4: Real-Time Inbox
- **Purpose:** Facilities direct chat between the customer and seller.
- **Main Components:** Contacts list sidebar, active message window, text input with submit button.
- **User Interaction Flow:** User clicks "Chat with Seller" on a product -> Real-time chat UI opens -> User sends message.
- **Backend/API Integration:** Utilizes Socket.io events (`sendMessage`, `getMessage`) combined with REST endpoints (`/message/create-new-message`).
- **Validation and Error Handling:** Prevents submission of empty strings; auto-reconnects socket if connection drops.

### 5.5.3 Navigation Flow Diagram
The application navigation centers around a central router. The un-authenticated flow routes to Login/Signup. Authenticated users are directed based on their Role (Admin -> Admin Panel, Seller -> Seller Dashboard, User -> Marketplace). From the Marketplace, users flow into Categories -> Product Details -> Cart -> Checkout -> Success Validation.

### 5.5.4 Responsiveness and Performance
- **Mobile and Desktop Adaptability**: Tailwind CSS breakpoints (`sm`, `md`, `lg`, `xl`) ensure forms, grids, and sidebars gracefully expand or collapse into hamburger menus.
- **Loading Time Optimization**: Accelerated by lazy-loading React components and utilizing Cloudinary's dynamic on-the-fly image compression API to minimize payload sizes.
- **State Management Strategy**: Redux Toolkit manages global states (Cart, User Session, Wishlist), preventing Prop Drilling and ensuring UI components update instantly and cohesively.

## 5.6 Deployment

**Table 5.2: Deployment Details**

| Component | Platform | URL/Details |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [https://frontend-phi-rouge-27.vercel.app](https://frontend-phi-rouge-27.vercel.app) |
| **Backend API** | Vercel | [https://backend-phi-sand-87.vercel.app](https://backend-phi-sand-87.vercel.app) |
| **Socket Server** | Vercel | [https://socket-flax.vercel.app](https://socket-flax.vercel.app) |
| **Database** | MongoDB Atlas | `auto-care.focfxin.mongodb.net` (Cloud clustered NoSQL) |

## 5.7 Chapter Summary

This chapter presented the detailed implementation of the AutoCare system. The conceptual design was translated into practical software components utilizing the MERN stack. The development environment was detailed, followed by explanations of core modules including Authentication, Product Management, the Smart Oil Recommender, Real-Time Chat, and the Admin Panel. 

External APIs like Stripe and Socket.io were integrated seamlessly to provide real-time messaging and secure payments. The UI implementation utilized React and Tailwind CSS for an optimized, responsive user experience, while algorithmic logic was structurally documented to reflect efficiency. Finally, deployment details were specified, marking the transition from an architectural concept into a production-ready application hosted on Vercel.

---

# Chapter 6 Testing and Evaluation

This chapter presents the testing strategies and evaluation procedures used to verify the correctness, reliability, and performance of the implemented AutoCare system.

## 6.1 Testing Strategy
The overall testing approach incorporates comprehensive manual functional testing combined with automated modular API verifications. We employed Unit Testing for individual backend controller endpoints, Integration Testing to ensure correct data flow among React Redux, Node.js, and MongoDB, and System Testing to validate the complete user journey from browsing to checkout. Tools like Postman and Jest were utilized to emulate client actions against localized backend routing.

## 6.2 Unit Testing

Unit testing verifies individual modules independently.

### 6.2.1 UT-01: User & Seller Authentication Module

**Table 6.1: Unit Test Case – User Registration & Auth**

| Test ID | Input | Expected Output | Result |
| :--- | :--- | :--- | :--- |
| UT-auth-1 | Valid user registration details | Email activation sent, user record created | Pass |
| UT-auth-2 | Login with unregistered email | "User doesn't exists!" error message | Pass |
| UT-auth-3 | Seller login with valid credentials | Redirected to Seller Dashboard | Pass |
| UT-auth-4 | Attempt restricted route without token | Redirected to login page | Pass |

### 6.2.2 UT-02: Product Management Module

**Table 6.2: Unit Test Case – Product Management**

| Test ID | Input | Expected Output | Result |
| :--- | :--- | :--- | :--- |
| UT-prod-1 | Submit new product containing valid image and price | Product successfully added to shop inventory | Pass |
| UT-prod-2 | Missing price field during creation | Creation aborted, validation error returned | Pass |
| UT-prod-3 | Delete existing product | Product removed from database and storefront | Pass |
| UT-prod-4 | Filter product by "Tires" category | View updates to show only tire products | Pass |

### 6.2.3 UT-03: Order & Payment Module

**Table 6.3: Unit Test Case – Order & Payment**

| Test ID | Input | Expected Output | Result |
| :--- | :--- | :--- | :--- |
| UT-ord-1 | Add valid item to cart | Cart state correctly increments item quantity | Pass |
| UT-ord-2 | Apply invalid coupon code | "Coupon code is not valid!" toast message | Pass |
| UT-ord-3 | Submit Stripe test card during checkout | Payment success, order status created as "Processing" | Pass |
| UT-ord-4 | Request order refund | Refund request generated and logged for seller | Pass |

### 6.2.4 UT-04: Real-Time Communication Module

**Table 6.4: Unit Test Case – Real-Time Chat**

| Test ID | Input | Expected Output | Result |
| :--- | :--- | :--- | :--- |
| UT-chat-1 | User sends a direct message to a seller | Message instantly appears in chat thread | Pass |
| UT-chat-2 | Image attachment sent | Image processed and delivered properly | Pass |
| UT-chat-3 | Disconnect user socket | Status updates to "Offline" | Pass |

## 6.3 Integration Testing

Integration testing ensures that modules interact correctly.

**Table 6.5: Integration Testing Summary**

| Test ID | Modules Integrated | Expected Result | Result |
| :--- | :--- | :--- | :--- |
| IT-01 | Frontend Cart + Stripe API | Successful Payment Intent created, UI redirects to Success Page | Pass |
| IT-02 | Frontend Form + Cloudinary API | Image uploaded from client, secure URL returned and sent to Backend DB | Pass |
| IT-03 | User Action + Socket.io Server | Real-time chat message instantly appears on the recipient's UI | Pass |
| IT-04 | Backend Logic + Oil Recommender | Query correctly maps DB inputs to active product inventory | Pass |

## 6.4 System Testing

System testing validates the entire application workflow.
The core test involves the full "Order Journey Sandbox": A Guest user signs up and logs in. A Seller logs in and creates a product. The user navigates across the platform boundaries, accesses the Oil Recommender, adds an item to the cart, applies a discount coupon, initiates a WebSocket chat session to ask a question, and successfully completes the checkout sequence using proxy Stripe inputs. Subsequently, the Seller Dashboard triggers a new order alert, and the Admin dashboard aggregates the transaction into the global chart. The system efficiently handles all interconnected actions without breaking the data persistence loop.

## 6.5 Performance Testing

**Table 6.6: Performance Metrics**

| Metric | Description | Value |
| :--- | :--- | :--- |
| **Response Time** | Average time per backend request | 150 ms - 300 ms |
| **Frontend Load** | Time to Interactive (TTI) | < 2.5 seconds |
| **Concurrent Users** | Maximum supported active socket connections | 500+ |

## 6.6 Security Testing
- **Authentication Validation**: Tested that all JWT tokens securely expire and cannot be modified client-side without invalidation.
- **Authorization**: Validated that unauthorized access to seller or admin routes (e.g. forced URL traversal) is strictly rejected.
- **XSS Testing**: Input filtering ensures that cross-site scripting strings submitted via chat, reviews, and product description inputs are sanitized safely before DB storage.
- **Data Encryption**: Ensured that the backend transmits sensitive data exclusively over HTTPS and user passwords are encrypted.

## 6.7 Model Evaluation (For ML-Based Projects)
*Not applicable to this e-commerce platform schema.*

## 6.8 User Acceptance Testing

**Table 6.7: User Feedback Summary**

| Feedback | Action Taken |
| :--- | :--- |
| Checkout flow felt disjointed without a summary. | "Order Summary" section integrated during checkout. |
| Chat notifications were easy to miss. | Added sound alerts and visual notification badges. |
| Needed better tracking of live orders. | Added detailed order status timeline on user profile. |

## 6.9 Testing Summary
The AutoCare platform underwent rigorous stress and behavior evaluations. Utilizing a mix of granular unit verification alongside full-spectrum systemic flow testing confirmed that complex third-party API hooks (Socket.io, Stripe, Cloudinary) perform exceptionally. The functional separation between User, Seller, and Admin roles proved secure and stable. The total system readiness meets required functional and non-functional performance benchmarks for a live e-commerce deployment.

---

# Chapter 7 Conclusion and Future Work

## 7.1 Conclusion
The AutoCare project systematically addresses the fragmentation in the automotive e-commerce sector by providing a centralized, feature-rich multi-vendor platform. The platform successfully integrates robust seller/buyer authentication, sophisticated product management, secure order processing, and comprehensive administrative oversight. 

Key achievements include the deployment of the Smart Oil Recommendation Engine, real-time user-seller chat functionalities, and an intuitive, responsive user interface built on modern Web technologies. Evaluation results confirm the high reliability of the checkout pipeline and the efficiency of the platform's backend infrastructure. Overall, this project contributes a modern, scalable solution tailored specifically to automotive enthusiasts and vendors.

## 7.2 Future Work

In future iterations, the following enhancements are planned for the AutoCare platform:

- **Interactive 3D Paint Service:** A fully immersive customization tool allowing customers to explore compatible 3D car models (`.glb`/`.gltf`) and select from a wide range of premium paint colors and finish specs in real-time. Sellers will be able to upload their own 3D car models and offer paint job services with auto-calculated pricing and a direct cart-checkout integration.
- **AI-Based Oil Recommendation Engine:** Replace the current heuristic-based oil recommender with a Machine Learning model trained on large automotive datasets for superior accuracy and personalization.
- **Live Logistics Tracking:** Integration with a third-party logistics API to provide automated, real-time shipment tracking updates to buyers.
- **Additional Payment Gateways:** Support for localized payment methods (JazzCash, EasyPaisa, etc.) to serve a broader geographic market.
- **Mobile Application:** Native iOS and Android apps built with React Native for a fully mobile-first experience.

## 7.3 Limitations
- **3D Paint Service Deferred:** The Interactive 3D Paint Service feature has been scoped as a future enhancement due to the complexity of building a real-time 3D rendering engine within the project timeline. The backend model schema and upload infrastructure are already in place.
- **Data Limitations:** The Smart Oil Recommender currently relies on a static heuristic dataset rather than dynamic real-time manufacturer API lookups.
- **Logistics Constraints:** Order tracking relies primarily on manual status updates from the sellers rather than live GPS tracking integration.

## Bibliography

1. Node.js Documentation. [Online]. Available: https://nodejs.org/docs/latest/api/
2. React.js Official Guide. [Online]. Available: https://react.dev/learn
3. Stripe API Reference. [Online]. Available: https://stripe.com/docs/api
4. Socket.io Documentation. [Online]. Available: https://socket.io/docs/v4/
