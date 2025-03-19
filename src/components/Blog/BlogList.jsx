import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import "./BlogList.css";
import { StoreContext } from "../../context/storeContext";
import Loader from "../Loader/Loader";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false); // Loading state
    const { url } = useContext(StoreContext); // Access the URL from StoreContext

    const fetchBlogs = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${url}/blog`);
            const blogsData = Array.isArray(response.data.data.data) ? response.data.data.data : [];
            setBlogs(blogsData);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setBlogs([]);
        } finally {
            setLoading(false); // Stop loading
        }
    }, [page, url]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const handleNextPage = () => setPage((prevPage) => prevPage + 1);
    const handlePreviousPage = () => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));

    return (
        <div className="blog-list-container">
            {loading ? (
                <Loader /> // Display Loader while loading
            ) : (
                <>
                    <div className="blog-grid">
                        {Array.isArray(blogs) && blogs.length > 0 ? (
                            blogs.map((blog, index) => (
                                <div
                                    className={`blog-card ${index % 2 === 0 ? "left-image" : "right-image"}`}
                                    key={blog._id}
                                >
                                    <img src={blog.image} alt={blog.title} className="blog-image" />
                                    <div className="blog-content">
                                        <h3 className="blog-title">{blog.title}</h3>
                                        <p className="blog-snippet">{blog.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No blogs available.</p>
                        )}
                    </div>
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                        <button onClick={handleNextPage}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default BlogList;