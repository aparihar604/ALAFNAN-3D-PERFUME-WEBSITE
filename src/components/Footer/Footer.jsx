import React, { useCallback, useContext, useEffect } from "react";
import "./Footer.css"; // Make sure to update your CSS
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { StoreContext } from "../../context/storeContext";
import axios from "axios";

const Footer = () => {
  const [categories, setCategories] = React.useState([]);
  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      console.log(token, "token");

      const response = await axios.get(`${url}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data || []);
      if (response?.data?.data?.length > 0) {
        // setSelectedCategory(response.data.data[0]); // Select the first category by default
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [url, token]);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-subscribes">
          <h2>Local Face</h2>
          <p>Subscribe to Our Newsletter:</p>
          <p>Receive Updates on New Arrivals and Special Promotions!</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email here" />
            <button type="submit">Submit</button>
          </form>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/share/18iXoCFCpk/?mibextid=LQQJ4d"
              target="_blank"
            >
              <FaFacebookF />
            </a>
            {/* <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a> */}
            <a
              href="https://www.instagram.com/al_afnan_perfume_factory/profilecard/?igsh=MTd4b2s1cWo5eTdybw=="
              target="_blank"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Categories</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="/shop">{category.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h3>Shopping</h3>
            <ul>
              <li>
                <a href="#">Payments</a>
              </li>
              <li>
                <a href="#">Delivery options</a>
              </li>
              <li>
                <a href="#">Buyer protection</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Customer care</h3>
            <ul>
              <li>
                <a href="#">03122374227</a>
              </li>
              <li>
                <a href="#">alsaadalafnanelegant@gmail.com</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Pages</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/About">About Us</a>
              </li>
              <li>
                <a href="/Shop">Shop</a>
              </li>
              {/* <li><a href="#">Contact Us</a></li> */}
              <li>
                <a href="/Blog">Blog</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider line */}
      <hr style={{ margin: "10px 0" }} />

      <div className="footer-bottom">
        <p>© 2023 Local Face Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
