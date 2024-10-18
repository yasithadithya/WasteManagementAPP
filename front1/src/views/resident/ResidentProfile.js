import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Avatar, Grid, Button, TextField, IconButton, Box, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';
import { useNavigate } from 'react-router-dom';

const ResidentProfile = () => {
  const navigate = useNavigate();

  // Dummy resident data (replace with API call data)
  const residentData = localStorage.getItem('resident');
  let resident = null;
  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(resident);
  const [formData, setFormData] = useState(profileData);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  // Toggle Edit Mode
  const handleEditClick = () => setIsEditing(!isEditing);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Password Change Input
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Save Profile Changes
  const handleSaveClick = async () => {
    try {
      await axios.put(`http://localhost:2025/api/resident/${resident._id}`, formData);
      setProfileData(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating resident profile:', error);
      toast.error('Error updating profile. Please try again.');
    }
  };

  // Handle Password Change
  const handlePasswordChangeClick = () => {
    // Make an API call to change the password
    if (passwordData.newPassword !== '') {
      toast.success('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } else {
      toast.error('Please enter a new password.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('resident'); // Remove resident data from localStorage
    toast.success('Logged out successfully!');
    navigate('/resident'); // Redirect to login page
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <Card elevation={4} sx={{ p: 3, borderRadius: '16px', backgroundColor: '#f5f5f5' }}>
              <Grid container justifyContent="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: '#1976d2', fontSize: 36 }}>
                  {profileData.name.charAt(0)}
                </Avatar>
              </Grid>
              <CardContent>
                <Typography variant="h4" align="center" gutterBottom>
                  {profileData.name}
                </Typography>

                {/* Profile Info */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Email:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.email}</span>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Contact:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.contactNumber}</span>
                      )}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Address:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.address}</span>
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Account Details */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Account Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Account Number:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.accountNumber}</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Bank:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="bank"
                          value={formData.bank}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.bank}</span>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Branch:</strong>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          variant="outlined"
                        />
                      ) : (
                        <span style={{ marginLeft: '8px' }}>{profileData.branch}</span>
                      )}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Password Change */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <TextField
                  fullWidth
                  name="oldPassword"
                  label="Old Password"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  name="newPassword"
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handlePasswordChangeClick}
                  sx={{ mb: 2 }}
                >
                  Change Password
                </Button>

                {/* Action Buttons */}
                <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                  {isEditing ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveClick}
                      sx={{ mr: 2 }}
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton onClick={handleEditClick} color="primary">
                      <EditIcon />
                    </IconButton>
                  )}
                </Box>

                {/* Logout Button */}
                <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Toast Notification Container */}
        <ToastContainer />
      </Container>
      <Footer role="resident" />
    </div>
  );
};

export default ResidentProfile;
