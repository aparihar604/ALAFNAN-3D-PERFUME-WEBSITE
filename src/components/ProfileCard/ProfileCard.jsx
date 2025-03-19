// src/components/ProfileCard.js
import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  ListItem,
  ListItemText,
} from "@mui/material";
import {  MdClose } from "react-icons/md";
import { View } from "@react-three/drei";
import Scene from "../../pages/SceneSix";
import ViewCanvas from "../viewCanvas/viewCanvas";
import { assets } from "../../assets/assets";
import moment from "moment";

const ProfileCard = ({ item, activeTab, handleRemove, index ,arr,modelPath="/brown_perfume_bottle1.glb"}) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        {/* Left Image */}
      
        <Box
        component={'img'}
        src={assets.CollectionFifth}
          sx={{
            width: 60,
            height: 60,
            borderRadius: 2,
            objectFit: "cover",
            mr: 2,
          }}
        />
        {/* Right Content */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{item?.name}</Typography>
          {activeTab === 0 && (
            <>
              <Typography>MRP: {item?.price}</Typography>
              <Typography>Quantity: {item?.quantity}</Typography>
            </>
          )}
          {(activeTab === 1 ) && (
            <>
              <Typography>Order Date: {moment(item?.updatedAt).format('DD-MM-YYYY')}</Typography>
              <Typography>Quantity: {item?.products?.[0]?.quantity}</Typography>
                <Typography>MRP: {item?.amount}</Typography>
            </>
          )}
        </Box>
        {activeTab === 0 && (
          <IconButton
            sx={{ color: "white" }}
            onClick={() => handleRemove(item?._id)}
          >
            <MdClose />
          </IconButton>
        )}
        {(activeTab === 1) && (
          <Typography
            sx={{
              color: item?.status === 'pending' ?  "orange" :"green" ,
              fontWeight: "bold",
              textTransform:'capitalize'
            }}
          >
            {item?.status}
          </Typography>
        )}
        {activeTab === 2 && (
          <ListItemText primary={item?.label} sx={{ color: "white" }} />
        )}
      </Box>
      {index < arr.length - 1 && <Divider sx={{ bgcolor: "white" }} />}
     
    </>
  );
};

export default ProfileCard;
