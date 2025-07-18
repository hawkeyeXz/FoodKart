"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { apiCall, API_ENDPOINTS, API_BASE_URL } from "../config/api"
import FoodCard from "../components/FoodCard"
import LoadingSpinner from "../components/LoadingSpinner"
import EmptyState from "../components/EmptyState"

const Home = () => {
  const [foodItems, setFoodItems] = useState([])
  const [foodCategories, setFoodCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchFoodData()
  }, [])

  const fetchFoodData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching food data...") // Debug log

      const data = await apiCall(API_ENDPOINTS.GET_FOOD_DATA, {
        method: "POST",
      })

      console.log("Food data received:", data) // Debug log

      if (data.success) {
        setFoodItems(data.foodItems || [])
        setFoodCategories(data.foodCategory || [])
        if (data.foodCategory && data.foodCategory.length > 0) {
          setActiveCategory(data.foodCategory[0].CategoryName)
        }
      } else {
        setError(data.message || "Failed to load food data")
      }
    } catch (error) {
      console.error("Error fetching food data:", error)
      setError("Failed to load food data. Please make sure the backend server is running on http://localhost:5000")
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = foodItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.CategoryName === activeCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <LoadingSpinner message="Loading delicious meals..." />
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <div className="mt-3">
            <button className="btn btn-outline-danger me-2" onClick={fetchFoodData}>
              Try Again
            </button>
            <small className="text-muted d-block mt-2">
              Make sure your backend server is running on http://localhost:5000
            </small>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <motion.div
                className="hero-content"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="hero-title">
                  Delicious Food
                  <br />
                  <span className="text-warning">Delivered Fast</span>
                </h1>
                <p className="hero-subtitle">
                  Order your favorite meals from the best restaurants in town and get them delivered to your doorstep in
                  minutes.
                </p>
                <div className="row">
                  <div className="col-md-8">
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for food..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-light" type="button">
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Delicious Food"
                  className="img-fluid rounded-3 shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-5">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Our Menu</h2>
              <p className="lead text-muted">Choose from our wide variety of delicious meals</p>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs justify-content-center mb-4">
              <button
                className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All Items
              </button>
              {foodCategories.map((category) => (
                <button
                  key={category._id}
                  className={`category-tab ${activeCategory === category.CategoryName ? "active" : ""}`}
                  onClick={() => setActiveCategory(category.CategoryName)}
                >
                  {category.CategoryName}
                </button>
              ))}
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-4">
                <h5>
                  Search results for "{searchTerm}" ({filteredItems.length} items found)
                </h5>
              </div>
            )}

            {/* Food Items Grid */}
            {filteredItems.length > 0 ? (
              <div className="row g-4">
                {filteredItems.map((item, index) => (
                  <div key={item._id} className="col-lg-3 col-md-4 col-sm-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <FoodCard foodItem={item} />
                    </motion.div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="bi-search"
                title="No items found"
                message={searchTerm ? `No items match "${searchTerm}"` : "No items available in this category"}
                actionButton={
                  searchTerm && (
                    <button className="btn btn-primary-custom" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </button>
                  )
                }
              />
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
