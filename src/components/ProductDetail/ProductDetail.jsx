import { AddShoppingCart } from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import {
  Box,
  Button,
  Rating,
  Tab,
  Tabs,
  Typography
} from "@mui/material";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { animated } from "react-spring";
import { StoreContext } from "../../context/storeContext";
import { addToCart } from "../../Helper/Profile";
import Card from "../Card/Card";
import "./ProductDetail.css";
import Scene from "./Scene";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const { url, toggleDrawer ,token, setShowSignup } = useContext(StoreContext);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}/product/show/${id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchProducts();
  }, [id, url]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight / 2) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProductClick = (productId) => {
    window.location.href=`/product/${productId}`
    // navigate(`/product/${productId}`);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/product/all`);
      const productList = response.data.data.data.filter((item)=>item._id !== id);
      setProducts(productList || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [url,id]);

  

  const handleAddToCart = (product) => {
    if (!token) {
      setShowSignup(true)
      return ;
    }
    addToCart(product);
    handleButtonClick();
    toggleDrawer();
  };

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const sceneRef = useRef(null); // Ref to trigger the animation from outside the Scene

  const handleButtonClick = () => {
    // Trigger the sinking animation in Scene when the button is clicked
    if (sceneRef.current) {
      sceneRef.current.startSinking(); // Call the method to start sinking
    }
  };

  return (
    <>
    <div>
    <div className="Model-container" >
        <Scene
          ref={sceneRef}
          modelPath={
            product?.imageModel
              ? `/${product?.imageModel}`
              : 
              "/open.glb"
            }
            />
            </div>
      <div className="view-container">

        <Box
          sx={{ backgroundColor: "#000", color: "#fff", minHeight: "80vh",paddingBottom:'10px' }}
        >
          <Box
            sx={{
              position: "relative",
              height: "90vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000", // Black background
              overflow: "hidden",
            }}
          >
            {/* Background Text */}
            <Typography
              variant="h1"
              sx={{
                color: "rgba(255, 255, 255, 0.1)", // Light gray, semi-transparent
                fontSize: "14vw",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                whiteSpace: "pre-wrap",
                textAlign: "center",
                zIndex: 1,
                overflowWrap: "break-word",
                wordBreak: "break-word",
                width: "90%",
                // top:50,
                overflow: "hidden",
                position: "absolute",
              }}
            >
              {product?.name}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
              backgroundColor: "#000",
              color: "#fff",
              scale: 1,
              // height: "70vh",
              padding: "24px",
              flexDirection: { xs: "column", md: "row" }, // Default to column on small screens, row on medium and larger screens

            }}
          >

            
            {/* Left Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
              }}
            >
              <Typography
                variant="h3"
                sx={{ fontWeight: "bold", marginBottom: "16px" }}
              >
                {product?.name}
              </Typography>
              <Typography variant="h5" sx={{ marginBottom: "8px" }}>
                M.R.P – ${product?.prices ? Object.values(product?.prices)[0] : "Price not available"} (Inclusive of all taxes)
              </Typography>

              {/* Features */}
              <Box
                sx={{
                  display: "flex",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                  }}
                >
                  50ML
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                  }}
                >
                  Attar
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AccessTimeOutlinedIcon />}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                  }}
                >
                  Long-lasting
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LightModeOutlinedIcon />}
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    textTransform: "none",
                  }}
                >
                  Light
                </Button>
              </Box>

              {/* Notes */}
              <Box>
                <Typography variant="subtitle1">
                  <strong>Top Notes:</strong> Bergamot, Lavender
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Heart Notes:</strong> Rose, Jasmine
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Base Notes:</strong> Amber, Musk
                </Typography>
              </Box>
            </Box>



            {/* Right Section */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                padding: "16px",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons
                sx={{
                  mb: 2,
                  "& .MuiTab-root": {
                    color: "white",
                    textTransform: "none",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    lineHeight: "28.8px",
                    textAlign: "left",
                    textDecoration: "none",
                    textUnderlinePosition: "from-font",
                    textDecorationSkipInk: "none",
                    padding: "0px",
                    paddingRight: "10px",
                  },
                  "& .MuiTabScrollButton-horizontal": { display: "none" },
                  "& .MuiTabs-indicator": { backgroundColor: "transparent" },
                }}
              >
                <Tab label="Description" />
                <Tab label="Additional Information" />
              </Tabs>
              <Typography sx={{ marginBottom: "16px" }}>
                {product?.description}
              </Typography>

              {/* Rating */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Rating
                  name="read-only"
                  value={4.5} // You can adjust this value dynamically
                  precision={0.5} // Adjust precision as needed
                  readOnly
                  emptyIcon={<StarBorderOutlinedIcon fontSize="inherit" />} // Empty star as grey
                  sx={{
                    color: "white", // Color for filled stars (white)
                    "& .MuiRating-iconFilled": {
                      color: "white", // Ensure filled stars are white
                    },
                    "& .MuiRating-iconEmpty": {
                      color: "grey", // Ensure empty stars are grey
                    },
                    fontSize: "2rem", // Increase the size of the stars (adjust as needed)
                  }}
                />
                <Typography sx={{ marginLeft: "8px" }}>4.5</Typography>
              </Box>
            </Box>
          </Box>

          {/* Section with Image in Between Cards */}
          <Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // 1 column on mobile/tablet, 2 columns on desktop
    gap: "24px", // Optional: add a gap between the columns
    alignItems: "center",
    padding: "24px",
  }}
>
  {/* Left Card */}
  {products?.[0] && (
    <div
      key={products[0]._id}
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        name={products[0].name}
        price={products[0].prices ? Object.values(products[0].prices)[0] : "Price not available"}
        type={products[0].category ? products[0].category.name : "no category"}
        modelPath={
          products[0].imageModel ? `/${products[0].imageModel}` : "/purple_perfume_bottle1.glb"
        }
        text={products.description}
        onClick={() => handleProductClick(products[0]._id)}
      />
    </div>
  )}


  {/* Right Card */}
  {products?.[1] && (
    <div
      key={products[1]._id}
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        name={products[1].name}
        price={products[1].prices ? Object.values(products[1].prices)[0] : "Price not available"}
        type={products[1].category ? products[1].category.name : "no category"}
        modelPath={
          products[1].imageModel ? `/${products[1].imageModel}` : "/purple_perfume_bottle1.glb"
        }
        text={products.description}
        onClick={() => handleProductClick(products[1]._id)}
      />
    </div>
  )}
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
              marginBottom: "20px",
              zIndex:999,
              margin: "auto",
              "&:hover": {
                backgroundColor: "#FF6347", // On hover background color changes to orange
                color: "white", // On hover text color changes to white
              },
            }}
            startIcon={<AddShoppingCart />} // Icon before text
            onClick={() => handleAddToCart(product)} // Handle add to cart functionality
          >
            Add to Bag
          </Button>
        </Box>
      </div>
      </div>
    </>
  );
};

export default ProductDetail;
