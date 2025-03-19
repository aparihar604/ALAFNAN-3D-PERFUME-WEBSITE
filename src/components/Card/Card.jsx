import React, { useState } from "react";
import { Box, Typography, Card as MUICard, CardContent, Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "./Card.css";
import "../../components/Hero/Hero.css";
import { View } from "@react-three/drei";
import Scene from "../ProductList/Scene";

const Card = ({
  name = "",
  price = "",
  type = "",
  modelPath,
  text,
  onClick
}) => {
  const [hovered, setHovered] = useState(false);
  console.log(modelPath,'modalPath');
  return (
    <MUICard
      className="hover-card"
      sx={{
        display: "flex",
        position: "relative",
        width: 600,
        zIndex: 0,
        height: 200,
        borderRadius: 2,
        overflow: "hidden",
        marginTop: "20px",
        boxShadow: 3,
        bgcolor: "transparent",
        transition: "box-shadow 0.5s ease",
        "&:hover": {
          boxShadow: 6,
        },
        "&:hover .rating-stars": {
          transform: "translateY(20px)", // Slide rating out
          opacity: 0,
        },
        "&:hover .add-to-cart": {
          transform: "translateY(0)", // Slide button in
          opacity: 1,
        },
      }}
      onMouseEnter={() => setHovered(true)} // Hover in
      onMouseLeave={() => setHovered(false)} // Hover out
    >
      {/* Border Section */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "72%",
          border: "2px solid #fff",
          pointerEvents: "none",
          zIndex: 40,
          overflow:'hidden',
          borderRadius: "24px",
          boxSizing: "border-box",
        }}
      />
      <CardContent
        className="text-section"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          p: 2,
          zIndex: 2,
          overflow:'hidden',
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          width: "60%",
          transition: "transform 0.8s ease",
        }}
      >
        <Typography
          variant="h7"
          component="div"
          fontWeight="bold"
          sx={{ fontFamily: "Poppins", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {name}
        </Typography>
        <Typography
          variant="body3"
          sx={{ fontFamily: "Poppins", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          Type: {type}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontFamily: "Poppins", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          Price: ₹{price}
        </Typography>

        <Box
          className="rating-stars"
          sx={{
            display: "flex",
            position:!hovered?'relative':'absolute',
            alignItems: "center",
            whiteSpace: "normal", overflow: "hidden",
            gap: "4px",
            transition: "transform 0.5s ease, opacity 0.5s ease",
          }}
        >
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} sx={{ fontSize: "18px", color: "#FFD700" }} />
          ))}
        </Box>

        <Button
          className="add-to-cart"
          variant="outlined"
          onClick={onClick}
          sx={{
            marginTop: "8px",
            position:hovered?'relative':'absolute',
            textTransform: "none",
            fontFamily: "Poppins",
            fontWeight: "bold",
            borderColor: "white",
            color: "white",
            // transform: "translateY(-10px)",
           whiteSpace: 'nowrap',
            width: 'max-content',
            padding: '7px 20px',
            overflow:'hidden',
            borderRadius: '24px',
            opacity: 0,
            transition: "transform 0.5s ease, opacity 0.5s ease, background-color 0.3s ease, color 0.3s ease",
            "&:hover": {
              backgroundColor: "orange",
              borderColor: "orange",
              color: "#fff",
            },
          }}
        >
          Add to Cart
        </Button>
      </CardContent>

      <Box
        className="image-section"
        sx={{
          top: 0,
          right: 0,
          bottom:"20px",
          height: "100%",
          width: "50%",
          zIndex: 999,
          transform: "translate(10px, 10px)",
          transition: "transform 0.8s ease",
        }}
      >
          <Scene modelPath={modelPath} modelText={text} />
      </Box>
    </MUICard>
  );
};

export default Card;
