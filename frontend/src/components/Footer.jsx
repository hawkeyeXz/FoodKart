import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-basket-fill me-2"></i>
              FoodKart
            </h5>
            <p className="text-muted">
              Delicious food delivered to your doorstep. Order your favorite meals from the best restaurants in town.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-twitter fs-5"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-youtube fs-5"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/help" className="text-muted text-decoration-none">
                  Help
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Food Street, City
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                info@foodkart.com
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Download App</h6>
            <p className="text-muted small mb-3">Get our mobile app for better experience</p>
            <div className="d-flex flex-column gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-apple me-2"></i>App Store
              </a>
              <a href="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-google-play me-2"></i>Google Play
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">© {new Date().getFullYear()} FoodKart. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-muted text-decoration-none me-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted text-decoration-none">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
