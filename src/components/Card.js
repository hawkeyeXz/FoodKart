import React from "react";
import { motion } from "framer-motion";


export default function FoodCard({ image, title, description, price }) {
  return (
    <>
      <motion.div 
        className="card shadow-lg" 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "18rem", borderRadius: "15px", overflow: "hidden" }}
      >
        <img src={image} className="card-img-top" alt={title} style={{ height: "180px", objectFit: "cover" }} />
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <h6 className="text-success">${price}</h6>
          <button className="btn btn-primary">Order Now</button>
        </div>
      </motion.div>
    </>
  );
}
