import { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Suspense, Loader } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { StoreContext } from "../../context/storeContext";
import FloatingModel from "../FloatingModel/FloatingModel";
import "./ProductDetail.css";

const Scene = ({ modelPath, FLOAT_SPEED = 1.5 }) => {
    const model1Ref = useRef(null);
    const groupRef = useRef(null);

    useFrame((state, delta) => {
        if (model1Ref.current) {
            model1Ref.current.rotation.y += delta * 0.05; // Continuous spinning animation
        }
    });

    useEffect(() => {
        if (!model1Ref.current) return;

        const isMobile = window.innerWidth <= 1026;
        const initialPosition = isMobile ? { x: 0, y: -0.3 } : { x: 1.2, y: 0.2 };

        gsap.set(model1Ref.current.position, initialPosition);

        const introTl = gsap.timeline({
            defaults: {
                duration: 3,
                ease: "back.out(1.4)",
            },
        });

        if (window.scrollY < 20) {
            introTl
                .from(model1Ref.current.position, { y: 5.3, x: initialPosition.x }, 0)
                .from(model1Ref.current.rotation, { z: 3 }, 0);
        }

        const scrollTl = gsap.timeline({
            defaults: {
                duration: 2,
            },
            scrollTrigger: {
                trigger: ".hero-container",
                pin: true,
                start: "top top",
                end: "+=500",
                scrub: 2,
                immediateRender: false,
                ease: "power1.inOut",
            },
        });

        scrollTl
            .to(model1Ref.current.position, { x: isMobile ? 0 : -3, y: -0.2, z: 6 }, 0)
            .to(model1Ref.current.rotation, { z: 0.8 }, 0);
    }, [modelPath]);

    return (
        <group ref={groupRef}>
            <FloatingModel ref={model1Ref} modelPath={modelPath} floatspeed={FLOAT_SPEED} />
            <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
            <OrbitControls />
        </group>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { url } = useContext(StoreContext);
    const [quantity, setQuantity] = useState(1);

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
    }, [id, url]);

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddToCart = () => {
        console.log(`Adding ${quantity} of product ${product.name} to the cart.`);
    };

    if (loading) return <p>Loading...</p>;

    if (!product) return <p>Product not found.</p>;

    const modelUrl = `${url}/${product.imageModel}`;

    return (
        <div className="product-detail-container">
            <div className="product-content">
                <div className="model-container">
                    <Canvas>
                        <Suspense fallback={<div> dldldd</div>}>
                            <Scene modelPath={modelUrl} FLOAT_SPEED={1.5} />
                        </Suspense>
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>

                <div className="product-info">
                    <img
                        src={`${url}/${product.image}`}
                        alt={product.name}
                        className="product-detail-image"
                    />
                    <h2 className="product-detail-name">{product.name}</h2>
                    <p className="product-detail-price">${product.price}</p>
                    <p className="product-detail-description">{product.description}</p>
                    <p className="product-detail-discount">
                        Discount Price: ${product.discountPrice}
                    </p>
                    <p className="product-detail-quantity">Quantity:</p>
                    <div className="quantity-container">
                        <button onClick={() => setQuantity(quantity - 1)}>-</button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;