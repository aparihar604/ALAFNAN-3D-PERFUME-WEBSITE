import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/storeContext";
import "./MultiCarousel.css";
import Loader from "../Loader/Loader";

const MultiCarousel = ({ itemsPerSlide = 3 }) => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state
  const { url } = useContext(StoreContext);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${url}/product/featured`);
        setItems(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch is complete
      }
    };
    fetchItems();
  }, [url]);

  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const slideItems = Array.isArray(items)
    ? items.slice(currentIndex * itemsPerSlide, currentIndex * itemsPerSlide + itemsPerSlide)
    : [];

  return (
    <div className="carousel-container">
      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <>
          <button className="carousel-button left" onClick={prevSlide}>
            &#10094;
          </button>
          <div className="carousel-slide">
            {slideItems.map((item, index) => (
              <div className="carousel-item" key={item._id || index}>
                <img
                  src={`/${item.image}`}
                  alt={item.name}
                  className="carousel-item-image"
                />
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Discount Price: ${item.discountPrice}</p>
              </div>
            ))}
          </div>
          <button className="carousel-button right" onClick={nextSlide}>
            &#10095;
          </button>
        </>
      )}
    </div>
  );
};

export default MultiCarousel;