import { Link } from "react-router-dom"
import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer mt-auto py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="footer-heading">FoodKart</h5>
            <p className="text-muted">
              Delicious food delivered to your doorstep. Order your favorite meals from the best restaurants in town.
            </p>
            <div className="social-icons">
              <a href="#" className="me-3">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="me-3">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="me-3">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="me-3">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-geo-alt me-2"></i> 123 Food Street, Foodville
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i> +1 (555) 123-4567
              </li>
              <li>
                <i className="bi bi-envelope me-2"></i> info@foodkart.com
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className="footer-heading">Download Our App</h5>
            <p className="text-muted">Get our mobile app for a better experience</p>
            <div className="app-buttons">
              <a href="#" className="btn btn-outline-light mb-2 d-block">
                <i className="bi bi-apple me-2"></i> App Store
              </a>
              <a href="#" className="btn btn-outline-light d-block">
                <i className="bi bi-google-play me-2"></i> Google Play
              </a>
            </div>
          </div>
        </div>

        <hr className="mt-4 mb-3" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">© {new Date().getFullYear()} FoodKart. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/terms">Terms</Link>
              </li>
              <li className="list-inline-item">
                <Link to="/privacy">Privacy</Link>
              </li>
              <li className="list-inline-item">
                <Link to="/cookies">Cookies</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

