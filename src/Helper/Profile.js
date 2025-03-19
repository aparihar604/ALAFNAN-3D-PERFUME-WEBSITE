import axios from "axios";

// Fetch data for Wishlist
export const fetchWishlistData = async () => {
  const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
  return savedCart;
};

// Fetch data for Order History
export const fetchOrderHistoryData = async (url, token) => {
  try {
    const response = await axios.get(`${url}/order`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'fetchOrderHistoryData');
    return response?.data?.data?.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
  }
};

// Fetch data for Pending Orders
export const fetchPendingOrdersData = async () => {
  return [
    {
      id: 2,
      name: "Product 2",
      date: "Oct 10, 2020",
      quantity: 2,
      total: "$156",
      status: "Pending",
      image: "/path/to/image4.jpg",
    },
  ];
};

// Fetch User Profile Data
export const fetchUserProfileData = async (url, token,userId) => {
  try {
    const response = await axios.get(`${url}/users/:id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "fetchUserProfileData");
    // Assuming the API response contains the user data in the structure below
    return {
      name: response?.data?.name || "John Doe",
      email: response?.data?.email || "john.doe@example.com",
      phone: response?.data?.phone || "+91-9876543210",
      location: response?.data?.location || "Mumbai, India",
      addresses: response?.data?.addresses || {
        home: "123 Street, City, Country",
        office: "19B, Tower C, Business Park, Mumbai, India",
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error; // Ensure that the error is thrown to be handled in the component
  }
};

// Add product to the cart (for managing the cart data)
export const addToCart = (product) => {
  if (!product || !product._id) {
    console.error("Invalid product data", product);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productIndex = cart.findIndex(item => item._id === product._id);

  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
};
