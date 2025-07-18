import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Cart from "./pages/Cart"
import MyOrders from "./pages/MyOrders"
import Profile from "./pages/Profile"

// Context
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createuser" element={<SignUp />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
