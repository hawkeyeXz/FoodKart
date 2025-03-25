# **FoodCart 🍔🚀**  

FoodCart is a **full-stack food ordering application** where users can browse food items, add them to a cart, and place orders seamlessly. Built with **MERN stack (MongoDB, Express, React, Node.js)**, it features **JWT-based authentication**, a **secure backend**, and a **dynamic frontend UI**.  

---

## **Features 🌟**  
✅ User Authentication (Signup/Login with JWT)  
✅ Browse and Search Food Items  
✅ Add to Cart & Place Orders  
✅ MongoDB-powered database  
✅ Responsive UI  

---

## **Tech Stack 🛠️**  
**Frontend:** React.js  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT, bcrypt.js  
**Styling:**  Bootstrap

---

## **Installation & Setup 🏗️**  

### **1️⃣ Clone the Repository**  
```bash
git clone https://github.com/hawkeye-m/FoodCart.git
cd FoodCart
```

### **2️⃣ Install Dependencies**  

#### **Backend Setup**  
```bash
cd backend
npm install
```

#### **Frontend Setup**  
```bash
cd ../frontend
npm install
```

### **3️⃣ Run the App**  

#### **Start Backend (Port: 4000)**  
```bash
cd backend
npm start
```

#### **Start Frontend (Port: 3000)**  
```bash
cd frontend
npm start
```

---

## **API Endpoints 🔗**  

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/api/auth/createuser` | Register a new user          |
| POST   | `/api/auth/loginuser`  | Login user                   |
| GET    | `/api/food/foodData`   | Fetch food items             |
| POST   | `/api/cart/add`        | Add item to cart             |
| GET    | `/api/orders`          | Get user orders              |

---

## **Contributing 🛠️**  
Want to improve FoodCart? Feel free to fork this repo and submit a pull request!  

---

