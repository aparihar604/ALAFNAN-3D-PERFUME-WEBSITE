import React, { useState, useEffect } from "react";
import axios from "axios";
import './Profile.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  // State variables
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/get-profile");
        const data = response.data;

        setName(data.name);
        setEmail(data.email);
        setProfilePic(data.profilePic);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile data.");
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  // Handle file input for profile picture
  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  // Update profile function
  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("profilePic", profilePic);
    formData.append("name", name);

    try {
      await axios.put("/api/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
    }
  };

  // Send OTP for email change
  const sendOtp = async () => {
    try {
      await axios.post("/api/send-otp", { email: newEmail });
      setIsOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Error sending OTP.");
    }
  };

  // Verify OTP and update email
  const verifyOtpAndUpdateEmail = async () => {
    try {
      const response = await axios.post("/api/verify-otp", {
        email: newEmail,
        otp,
      });

      if (response.data.success) {
        setEmail(newEmail);
        toast.success("Email updated successfully!");
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner or message
  }

  return (
    <div className="profile">
      <div className="profile-pic">
        {/* Display profile picture if available */}
        {profilePic && typeof profilePic === 'string' ? (
          <img src={profilePic} alt="Profile" />
        ) : (
          profilePic && <img src={URL.createObjectURL(profilePic)} alt="Profile" />
        )}
        <label>Profile Picture:</label>
        <input type="file" onChange={handleProfilePicChange} />
      </div>

      <div className="profile-form">
        <h2>Update Profile</h2>
        <div className="name">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="email">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your current email"
            readOnly
          />
        </div>

        <div className="new-email">
          <label>New Email:</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
          />
          <button onClick={sendOtp} disabled={!newEmail}>
            Send OTP
          </button>
        </div>

        {isOtpSent && (
          <div className="otp">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={verifyOtpAndUpdateEmail} disabled={!otp}>
              Verify OTP & Update Email
            </button>
          </div>
        )}

        <button onClick={updateProfile} disabled={!name || !profilePic}>
          Update Profile
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Profile;