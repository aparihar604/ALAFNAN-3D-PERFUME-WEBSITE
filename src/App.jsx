import { useState, Suspense, lazy, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Loader from "./components/Loader/Loader"; // Import your custom Loader component
import ProfilePage from "./pages/PersonalDetails/PersonalDetails";
import ProductDetail from "./pages/ProductDetail/ProductDetails";
import Home from "./pages/Home/Home";
import { StoreContext } from "./context/storeContext";

const About = lazy(() => import("./pages/About/AboutSection"));
const Shop = lazy(() => import("./pages/Shop/Shop"));
// const ProductDetail = lazy(() => import('./pages/PersonalDetails/PersonalDetails'));
const Signup = lazy(() => import("./components/signUp/signUp"));
const Wishlist = lazy(() => import("./pages/Wishlist/WishList"));
const BlogAll = lazy(() => import("./pages/BlogAll/BlogAll"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Profile = lazy(() => import("./components/Profile/Profile"));

const App = () => {
  const { showSignup } = useContext(StoreContext);

  return (
    <>
      <Navbar />

      {/* Conditionally render Signup component */}
      {showSignup && (
        <Suspense fallback={<Loader />}>
          <Signup />
        </Suspense>
      )}

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/blog" element={<BlogAll />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/personalDetails" element={<ProfilePage />} />
          {/* Route for ProductDetail */}
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
