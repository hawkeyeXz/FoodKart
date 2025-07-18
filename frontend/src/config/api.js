export const API_BASE_URL = "http://localhost:5000"
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/createuser",
  GET_USER: "/api/auth/getuser",
  UPDATE_PROFILE: "/api/auth/updateprofile",

  // Food endpoints - Fixed the endpoint path
  GET_FOOD_DATA: "/api/data/",

  // Cart endpoints
  GET_CART: "/api/cart",
  ADD_TO_CART: "/api/cart/add",
  UPDATE_CART: "/api/cart/update",
  REMOVE_FROM_CART: "/api/cart/remove",
  CLEAR_CART: "/api/cart/clear",

  // Order endpoints
  CREATE_ORDER: "/api/orders/create",
  GET_MY_ORDERS: "/api/orders/my-orders",
  GET_ORDER_BY_ID: "/api/orders",
  CANCEL_ORDER: "/api/orders/cancel",
}

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem("authToken")

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "auth-token": token }),
      ...options.headers,
    },
    ...options,
  }

  try {
    console.log(`Making API call to: ${url}`) // Debug log
    const response = await fetch(url, config)

    // Check if response is ok
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response has content
    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON")
    }

    const data = await response.json()
    console.log(`API Response:`, data) // Debug log

    return data
  } catch (error) {
    console.error("API call failed:", error)
    throw error
  }
}


