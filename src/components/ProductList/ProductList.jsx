import { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { StoreContext } from "../../context/storeContext";
import "./ProductList.css";
import { Tabs, Tab } from "@mui/material";
import Card from "../Card/Card";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data || []);
      if (response.data.data.length > 0) {
        setSelectedCategory(response.data.data[0]); // Select the first category by default
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [url, token]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const categoryFilter = selectedCategory ? `&category=${selectedCategory._id}` : "";
      const response = await axios.get(`${url}/product/all?page=${page}${categoryFilter}`);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, url]);

  // Initial category fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products whenever the category or page changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page, fetchProducts]);

  useEffect(() => {
    console.log("Categories:", categories);
    console.log("Products:", products);
  }, [categories, products]);
  
  // Handle next page
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);

  // Handle previous page
  const handlePreviousPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));

  // Handle product click (navigate to product details)
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle category change
  const handleCategoryChange = (event, newValue) => {
    if (categories[newValue]) {
      setSelectedCategory(categories[newValue]);
      setPage(1); // Reset page when category changes
    }
  };

  return (
    <div className="product-list-container">
      {loading && <Loader />}
      
      {/* Categories Container */}
      <div className="categories-container">
        <Tabs
          value={categories.findIndex((cat) => cat._id === selectedCategory?._id)}
          onChange={handleCategoryChange}
          textColor="inherit"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons
          sx={{
            mb: 2,
            "& .MuiTab-root": {
              color: "white",
              textTransform: "capitalize",
              fontFamily: "Poppins",
              fontWeight: 600,
              lineHeight: "28.8px",
              textAlign: "left",
              padding: "10px",
            },
            "& .MuiTabScrollButton-horizontal": { display: "none" },
            "& .MuiTabs-indicator": { backgroundColor: "#007bff" },
          }}
        >
          {categories.map((category, index) => (
            <Tab key={index} label={category.name} />
          ))}
        </Tabs>
      </div>
  
      {/* Check Products */}
      {!loading && (
        <>
          <div className="product-grid" style={{ display: "grid",  }}>
            {Array.isArray(products.data) && products.data.length > 0 ? (
              products.data.map((product) => ( 
                <div
                  key={product._id}
                  style={{
                    padding: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Card
                    name={product.name}
                    price={product.prices ? Object.values(product.prices)[0] : "Price not available"}
                    type={product.category.name}
                    modelPath={product?.imageModel ? `/${product.imageModel}` : "/purple_perfume_bottle1.glb"}
                    text={product?.description}
                    onClick={() => handleProductClick(product._id)}
                  />
                </div>
              ))
            ) : (
              <p>No products available.</p>
            )}
          </div>
  
          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
            {Array.from({ length: products?.totalPages ?? 5 }, (_, i) => i + 1).map((el) => (
              <button
                key={el}
                onClick={() => setPage(el)}
                style={{
                  backgroundColor: `${page === el ? "#ab572d" : "#fff"}`,
                  color: `${page === el ? "#fff" : "#000"}`,
                  border: "1px solid #ab572d",
                  padding: "5px 10px",
                  margin: "0 5px",
                }}
              >
                {el}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={!products?.isNextPage}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};  

export default ProductList;
