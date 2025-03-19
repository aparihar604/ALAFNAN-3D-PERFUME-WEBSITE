import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "../ProfileCard/ProfileCard";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AddShoppingCart } from "@mui/icons-material";

import "../../pages/PersonalDetails/ProfilePage.css";
import axios from "axios";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import CheckoutForm from "./ChekoutForm";

const CheckoutModal = ({ onClose }) => {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proceedToCheckOut, setProceedToCheckOut] = useState(true);
  const { cartItems, setCartItems } = useContext(StoreContext);

  const calculateTotal = (cartItems) => {
    return cartItems.reduce((total, item) => {
      // Ensure the price and quantity are valid
      const itemPrice = item.prices ? Object.values(item.prices)[0] : "Price not available" || 0; // Default to 0 if price is undefined
      const itemQuantity = item.quantity || 0; // Default to 0 if quantity is undefined
  console.log("itemPrice",itemPrice);
  console.log("item Quantity",itemQuantity);
      // Add the price of the item (price * quantity) to the total
      return total + itemPrice * itemQuantity;
    }, 0);
  };
  

  const handleToggleDrawer = () => {
    onClose();
  };

  const addToCart = (product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setTotal(calculateTotal(updatedCart));
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
    setTotal(calculateTotal(savedCart)); // Calculate the total correctly
  }, []);
  

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleProceedToCheckOut = () => {
    setProceedToCheckOut(false);
  };

  return (
    <div className="cart-drawer">
      {loading && <Loader />}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Your Cart
        </Typography>
        <IconButton onClick={handleToggleDrawer}>
          <CloseIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2, backgroundColor: "#424242" }} />
      {!proceedToCheckOut ? (
        <CheckoutForm cartItems={cartItems} total={total} />
      ) : (
        <List>
          {cartItems?.map((item, index) => (
            <>
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", color: "#fff" }}
                >
                  <img
                    src={`/${item.image}`}
                    alt={item.name}
                    style={{ width: 40, height: 40, marginRight: 10 }}
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={`Qty: ${item.quantity} | M.R.P: ₹${item.prices ? Object.values(item.prices)[0] : "Price not available"}`}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                    }}
                    secondaryTypographyProps={{
                      fontSize: "14px",
                      color: "#fff",
                    }}
                  />
                </Box>
                <IconButton
                  edge="end"
                  sx={{ color: "#fff" }}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <CloseIcon />
                </IconButton>
              </ListItem>
              <Divider sx={{ my: 2, backgroundColor: "#424242" }} />
            </>
          ))}
        </List>
      )}

      {proceedToCheckOut &&
        (cartItems.length > 0 ? (
          <>
            {" "}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                ₹{total}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                width: "80%", // 80% width
                borderRadius: "20px", // Border radius 20px
                backgroundColor: "#fff", // Initial background color (color can be changed here)
                color: "black", // Initial text color black
                textTransform: "none", // To prevent uppercase text transformation
                display: "flex",
                alignItems: "center", // Align icon and text
                justifyContent: "center",
                padding: "10px",
                marginTop: "16px",
                marginBottom: "2px",
                margin: "auto",
                "&:hover": {
                  backgroundColor: "#FF6347", // On hover background color changes to orange
                  color: "white", // On hover text color changes to white
                },
              }}
              startIcon={<AddShoppingCart />} // Icon before text
              onClick={handleProceedToCheckOut} // Handle add to cart functionality
            >
              CHECK OUT
            </Button>{" "}
          </>
        ) : (
          <Typography variant="h6">No Item Selected</Typography>
        ))}
    </div>
  );
};

export default CheckoutModal;
