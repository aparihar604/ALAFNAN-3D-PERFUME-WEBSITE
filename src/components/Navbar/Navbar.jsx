import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import Wishlist from "../../pages/Wishlist/WishList";
import { StoreContext } from "../../context/storeContext";
import { Button, Drawer } from "@mui/material";
import CheckoutModal from "../CheckoutModal/CheckoutModal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { token, setToken, isDrawerOpen, toggleDrawer, setShowSignup } =
    useContext(StoreContext);

  // Sample wishlist items for demonstration
  const [wishlistItems] = useState([
    { name: "Sample Item 1", image: assets.CollectionFirst, price: 15 },
  ]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleWishlist = () => setWishlistOpen(!wishlistOpen);

  const handleLogout = () => {
    setToken("");
    setUserDropdownOpen(false);
  };
  const location = useLocation();
  const { hash, pathname, search } = location;
  console.log(pathname, "pathname");

  return (
    <>
      <nav className="navbar">
        <div className="hamburger" onClick={toggleMenu}>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </div>

        <ul className={menuOpen ? "navbar-links active" : "navbar-links"}>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/" onClick={() => closeDrawerAndNavigate("/")}>Home</Link>
          </li>
          <li className={pathname === "/shop" ? "active" : ""}>
            <Link to="/shop" onClick={() => closeDrawerAndNavigate("/shop")}>Shop</Link>
          </li>
          <li className={pathname === "/about" ? "active" : ""}>
            <Link to="/about" onClick={() => closeDrawerAndNavigate("/about")}>About Us</Link>
          </li>
          <li className={pathname === "/blog" ? "active" : ""}>
            <Link to="/blog" onClick={() => closeDrawerAndNavigate("/blog")}>Blog</Link>
          </li>
        </ul>

        <div className="navbar-icons">
          {!token && (
            <button onClick={() => setShowSignup(true)}>Sign Up</button>
          )}

          <img
            src={assets.MagnifyingGlass}
            alt="Search"
            className="icon"
            onClick={toggleSearch}
          />
          {searchOpen && (
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          )}

          {/* Wishlist Icon */}

          {token && (
            <>
              <img
                src={assets.CartIcon} // Replace with actual heart icon asset
                alt="Wishlist"
                className="icon wishlist-icon"
                onClick={toggleDrawer}
              />

              <img
                src={assets.User}
                alt="User Profile"
                className="icon"
                onClick={toggleUserDropdown}
              />

              {userDropdownOpen && (
                <div
                  className={`user-dropdown ${userDropdownOpen ? "open" : ""}`}
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <ul>
                    {/* <li>
                      <Link to="/cart">Shopping Bag</Link>
                    </li> */}
                    <li>
                      <Link to="/personalDetails">My Orders</Link>
                    </li>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Wishlist Overlay */}
      {wishlistOpen && (
        <Wishlist
          wishlistItems={wishlistItems}
          closeWishlist={() => setWishlistOpen(false)}
        />
      )}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer()}
        sx={{
          "& .MuiDrawer-paper": {
            height: "100%", // Full height
            background: "linear-gradient(#3b3b3b, rgba(0, 0, 0, 0.8))", // Semi-transparent background
            backdropFilter: "blur(15px)", // Blur effect
            display: "flex",
            flexDirection: "column",
            color: "#fff",
            padding: "20px",
            overflowY: "auto",
            zIndex: 1300, // Ensure it's above other content
          },
        }}
      >
        <div style={{ width: 500, padding: 20 }}>
          <CheckoutModal onClose={() => toggleDrawer()} />
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;
