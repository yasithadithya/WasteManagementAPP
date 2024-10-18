import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, TextField, Button, Grid, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { Header, Footer } from '../../components/header'; // Assuming Header/Footer are shared
import axios from 'axios'; // Assuming you're using axios for API requests
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const UserProfile = () => {
  // Extract the manager (user) data from localStorage
  const manager = JSON.parse(localStorage.getItem('manager')); 

  const [formData, setFormData] = useState({
    firstName: manager.firstName,
    lastName: manager.lastName,
    email: manager.email,
    phoneNumber: manager.phoneNumber,
    password: '',
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(currentTime, 'PPP');
  const formattedTime = format(currentTime, 'p');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Save changes to the user's profile
  const handleSaveClick = async () => {
    try {
      // Make a PUT request to update the user's details using the backend's `/api/manager/:id` route
      const response = await axios.put(`http://localhost:2025/api/manager/${manager._id}`, formData);
      if (response.status === 200) {
        // Update local storage with the new manager data
        localStorage.setItem('manager', JSON.stringify(response.data));
        setIsEditing(false);

        // Show a success toast notification
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  // Logout function to remove user data from localStorage and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('manager'); // Remove the manager data from local storage
    navigate('/manager'); // Redirect to login page
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Top Bar with Date, Time, and Logout Button */}
      <AppBar position="static" sx={{ bgcolor: 'lightgreen', p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Profile Management
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mr: 2 }}>
              {formattedDate} | {formattedTime}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Form */}
      <Container sx={{ mt: 4 }}>
        <Box component="form" noValidate autoComplete="off" sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(5px)' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Edit Profile</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type="password"
                disabled={!isEditing}
                placeholder={isEditing ? 'Enter new password' : '******'}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              {isEditing ? (
                <Button variant="contained" color="primary" onClick={handleSaveClick}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleEditClick}>
                  Edit Profile
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Toast notification container */}
      <ToastContainer />

      {/* Footer */}
      <Footer role="manager" />
    </div>
  );
};

export default UserProfile;
