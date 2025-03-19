// src/components/ProfilePage.js
import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab, Box, Typography, IconButton ,List, ListItem, ListItemText, } from "@mui/material";
import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";
import { fetchWishlistData, fetchOrderHistoryData, fetchPendingOrdersData } from "../../Helper/Profile";
import "./ProfilePage.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import { StoreContext } from "../../context/storeContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { url, } = useContext(StoreContext);
    const navigate  =useNavigate();
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const token = localStorage.getItem('token');  // Retrieving userId from localStorage
  const useraName = localStorage.getItem('username');  // Retrieving userId from localStorage
  const usermail = localStorage.getItem('email');  // Retrieving userId from localStorage
  const userId = localStorage.getItem('userId');  // Retrieving userId from localStorage

  const fetchTabData = async (tabIndex) => {
    let response;
    setLoading(true);
    switch (tabIndex) {
      case 0:
        response = await fetchWishlistData();
        break;
      case 1:
        response = await fetchOrderHistoryData(url,token);
        break;
      // case 2:
      //   response = await fetchPendingOrdersData();
      //   break;
      case 2:
        response = await fetchAccountSettingsData();
        break;
      default:
        response = [];
    }
    setLoading(false);
    setData(response);
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const handleRemove = (productId) => {
      const updatedCart = data.filter(item => item._id !== productId);
      setData(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

 const fetchAccountSettingsData = async () => {
    const handleLogout = () => {
      setToken('');
      navigate('/');
    };
    return [
      { id: 1, label: "Edit Personal Details" },
      { id: 2, label: "Manage Addresses" },
      { id: 3, label: "Change Password" },
      { id: 4, label: "Log Out" ,onClick:handleLogout},
    ];
  };

  return (
    <Box className="profile-container" sx={{ bgcolor: "black", color: "white", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {loading && <Loader />}
      <Box className="profile-top-row" display="flex" gap={2} mb={3}>
        <Box className="profile-box" flex={1} p={3} border={1} borderColor="white" borderRadius={3}>
          <Typography variant="h6">Personal Details</Typography>
          <Typography>Name: {useraName}</Typography>
          <Typography>Email: {usermail}</Typography>
         
        </Box>
      
      </Box>

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
            padding: "10px",
          },
          "& .MuiTabScrollButton-horizontal": { display: "none" },
          "& .MuiTabs-indicator": { backgroundColor: "transparent" },
        }}
      >
        <Tab label="Wishlist" />
        <Tab label="Order History" />
        {/* <Tab label="Pending Orders" /> */}
        <Tab label="Account Settings" />
      </Tabs>

      <Box sx={{ backgroundColor: activeTab !== 2 ? "#FFFFFF0D" : "transparent", padding: activeTab !== 2 ? 1 : 0, borderRadius: 2 }}>
        {activeTab === 2 ? (
           <List>
           {data.map((item) => (
             <ListItem
               key={item.id}
               sx={{
                 display: "flex",
                 justifyContent: "space-between",
                 bgcolor: '#FFFFFF0D',
                 mb: 1,
                 borderRadius: 2,
                 px: 2,
               }}
             >
               <ListItemText primary={item?.label} sx={{ color: "white" }} />
               <IconButton sx={{ color: "white" }} onClick={item?.onClick ? ()=>item?.onClick(): null}>
                 <MdChevronRight />
               </IconButton>
             </ListItem>
           ))}
         </List>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {data?.map((item, index,arr) => (
              <ProfileCard key={item.id} item={item} activeTab={activeTab} handleRemove={handleRemove} index={index} arr={arr}/>
            ))}
            {data?.length===0 && (
               <div style={{textAlign:'center'}}>No data Found </div>
            )}
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

export default ProfilePage;
