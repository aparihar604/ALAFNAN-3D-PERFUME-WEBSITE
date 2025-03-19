import { createContext, useEffect, useState } from "react";

// Helper functions for managing cookies
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

const deleteCookie = (name) => {
  document.cookie = name + "=; Max-Age=-99999999;";
};

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");  // Retrieve token from localStorage
  const [devMode, setDevMode] = useState(false);
  // const url = devMode ? "http://localhost:3000" : "/api";
  const url =  "http://localhost:3000" ;
  const [cartItems, setCartItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer state
  const [showSignup, setShowSignup] = useState(false); // Drawer state

  // Function to open and close the drawer
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev); // Toggle drawer state
  };

  // Save token and username to localStorage on change
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);  // Save token to localStorage
    } else {
      localStorage.removeItem("token");  // Remove token from localStorage if empty
    }
  }, [token]);


  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const Items in cartItems) {
      if (cartItems[Items] > 0) {
        let itemInfo = food_list.find((product) => product._id === Items);
        totalAmount += itemInfo.price * cartItems[Items];
      }
    }
    return totalAmount;
  };

  const contextValue = {
    url,
    token,
    setToken,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    toggleDrawer,
    isDrawerOpen,
    showSignup,
    setShowSignup,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
