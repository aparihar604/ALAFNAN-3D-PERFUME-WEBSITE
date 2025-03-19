import React, { useState, useContext, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { StoreContext } from "../../context/storeContext"; 
import axios from "axios"; 
import "./CheckoutModal.css"; 

const CheckoutForm = ({ total, setOpen }) => { 
  const { url, toggleDrawer, cartItems } = useContext(StoreContext); 
  const navigate = useNavigate(); // React Router's hook for navigation

  // Define state variables for form fields 
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [address, setAddress] = useState(""); 
  const [city, setCity] = useState(""); 
  const [state, setState] = useState(""); 
  const [zip, setZip] = useState(""); 
  const [phone, setPhone] = useState("");  // State for phone number 
  const [selectedCountryName, setSelectedCountryName] = useState("India");  // Default to India
  const [selectedCountryCode, setSelectedCountryCode] = useState("IN");  // Default to IN
    
  // Static list of countries with their codes
  const countries = [
    { name: "Pakistan", code: "POK" },
    { name: "India", code: "IN" },
    { name: "Dubai", code: "AE" },  // Dubai is part of the United Arab Emirates, code is AE
    { name: "China", code: "CN" },
    { name: "Turkey", code: "TR" },
    { name: "Iran", code: "IR" },
    { name: "United States", code: "US" },  // "America" is the common term for the United States
    { name: "Sri Lanka", code: "LK" },
    { name: "Afghanistan", code: "AF" },
  ];

  const handleCheckout = async (event) => { 
    event.preventDefault(); 
    var deviceToken = localStorage.getItem("token"); 
  
    // Find the country code based on the selected country name
    const selectedCountry = countries.find((c) => c.name === country);
    const countryCode = selectedCountry ? selectedCountry.code : null;
  
    // Construct the payload dynamically from the form data
    const payload = { 
      products: cartItems.map((item) => ({ 
        productId: item._id, 
        quantity: item.quantity, 
      })), 
      amount: total, 
      address: { 
        name: name,  
        phone: phone,  
        email: email,  
        fullAddress: address,  
        city: city,  
        state: state,
        zip: zip,  // Add the zip code to address
        countryName: selectedCountryName, // Pass country name here
      }, 
      country: selectedCountryCode, // Pass country code here
  
      paymentMethod: "cod",  // Cash on Delivery (static for now)
    };
  
    try { 
      const response = await axios.post(`${url}/order/create`, payload, { 
        headers: { 
          Authorization: `Bearer ${deviceToken}`, 
        }, 
      });
  
      // Handle success
      console.log("Order created successfully:", response.data);
  
      // Clear cart after successful order creation
      localStorage.removeItem("cart");
  
      // Navigate to the personal details page
      navigate("/personalDetails");
  
      // Close the drawer after successful order creation
      toggleDrawer();
  
      // Optionally close the modal
      setOpen(false); 
    } catch (err) { 
      console.error("Error during checkout:", err); 
    } 
  };
  
  return ( 
    <div className="checkout-container"> 
      <form className="checkout-form" onSubmit={handleCheckout}> 
        <div className="form-group"> 
          <label htmlFor="name">Name</label> 
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your full name" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="email">Email</label> 
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="address">Address</label> 
          <input 
            type="text" 
            id="address" 
            name="address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter your address" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="city">City</label> 
          <input 
            type="text" 
            id="city" 
            name="city" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Enter your city" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="state">State</label> 
          <input 
            type="text" 
            id="state" 
            name="state" 
            value={state} 
            onChange={(e) => setState(e.target.value)} 
            placeholder="Enter your state" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="zip">Zip Code</label> 
          <input 
            type="text" 
            id="zip" 
            name="zip" 
            value={zip} 
            onChange={(e) => setZip(e.target.value)} 
            placeholder="Enter your zip code" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="phone">Phone Number</label> 
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="Enter your phone number" 
            required 
          /> 
        </div>

        <div className="form-group"> 
          <label htmlFor="country">Country</label> 
          <select 
            id="country" 
            name="country" 
            value={selectedCountryName} 
            onChange={(e) => {
              const selectedCountry = countries.find(country => country.name === e.target.value);
              setSelectedCountryName(selectedCountry.name); // Store country name
              setSelectedCountryCode(selectedCountry.code); // Store country code
            }} 
          >
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group"> 
          <label htmlFor="payment-method">Payment Method</label> 
          <select 
            id="payment-method" 
            name="payment-method" 
            required 
            defaultValue="cod"
          > 
            <option value="cod">Cash on Delivery</option> 
          </select> 
        </div>

        <button type="submit" className="checkout-button"> 
          Place Order 
        </button> 
      </form> 
    </div> 
  ); 
};

export default CheckoutForm;
