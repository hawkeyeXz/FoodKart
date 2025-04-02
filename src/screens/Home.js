"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Card from "../components/Card"
import "../styles/Home.css"

export default function Home() {
  const [foodCat, setFoodCat] = useState([])
  const [foodItems, setFoodItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const getFoodData = async () => {
      try {
        setLoading(true)
        const response = await fetch("{API_URL}/api/food/fooddata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setFoodItems(data.foodItems || [])
          setFoodCat(data.foodCategory || [])

          // Set the first category as active by default
          if (data.foodCategory && data.foodCategory.length > 0) {
            setActiveCategory(data.foodCategory[0]._id)
          }
        } else {
          throw new Error(data.message || "Failed to fetch food data")
        }

        setError(null)
      } catch (error) {
        console.error("Error fetching food data:", error.message)
        setError("Failed to load menu. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    getFoodData()
  }, [])

  // Filter food items based on search term
  const filteredItems = foodItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="hero-title">Delicious Food Delivered to Your Door</h1>
              <p className="hero-subtitle">Order your favorite meals from the best restaurants in town</p>
              <div className="search-container">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search for food..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-primary" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 d-none d-md-block">
              <img src="/placeholder.svg?height=400&width=500" alt="Delicious Food" className="img-fluid hero-image" />
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading delicious meals...</p>
          </div>
        ) : (
          <>
            {/* Category Navigation */}
            <div className="category-nav mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title">Our Menu</h2>
              </div>

              <div className="category-tabs">
                {foodCat && foodCat.length > 0 ? (
                  foodCat.map((category) => (
                    <button
                      key={category._id}
                      className={`category-tab ${activeCategory === category._id ? "active" : ""}`}
                      onClick={() => setActiveCategory(category._id)}
                    >
                      {category.CategoryName}
                    </button>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </div>
            </div>

            {/* Food Items */}
            {searchTerm ? (
              // Search results
              <div className="row">
                <h3 className="mb-3">Search Results for "{searchTerm}"</h3>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-4">
                      <Card title={item.name} image={item.img} options={item.options[0]} />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
                    <p className="mt-3">No items found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            ) : // Category display
            foodCat && foodCat.length > 0 ? (
              foodCat.map((category) => (
                <div
                  key={category._id}
                  className={`category-section ${activeCategory === category._id ? "" : "d-none"}`}
                >
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="category-title">{category.CategoryName}</h3>
                    <hr className="flex-grow-1 ms-3" />
                  </div>

                  <div className="row">
                    {foodItems
                      .filter((item) => item.CategoryName === category.CategoryName)
                      .map((item) => (
                        <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-4">
                          <Card title={item.name} image={item.img} options={item.options[0]} />
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <p>No categories available</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

