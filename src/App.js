import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

// Import screens
import Home from "./screens/Home"
import Login from "./screens/Login"
import SignUp from "./screens/SignUp"
import Cart from "./screens/Cart"
import MyOrders from "./screens/MyOrders"
import Profile from "./screens/Profile"

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/createuser" element={<SignUp />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route exact path="/my-orders" element={<MyOrders />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

