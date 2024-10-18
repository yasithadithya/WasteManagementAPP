import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { Header, Footer } from '../../components/header';
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const ResidentHome = () => {
  const residentData = localStorage.getItem('resident');
  let resident = null;

  try {
    resident = residentData ? JSON.parse(residentData) : null;
  } catch (e) {
    console.error('Invalid resident data in localStorage', e);
    resident = null;
  }

  const [currentTime, setCurrentTime] = useState(new Date());
  const [wasteBins, setWasteBins] = useState([]);
  const [totalPoints, setTotalPoints] = useState(); // State to hold total points
  const [open, setOpen] = useState(false); // For opening the dialog to add a new waste bin
  const [binID, setBinID] = useState(''); // Store binID when adding a new waste bin
  const [searchResults, setSearchResults] = useState([]); // Store search results for waste bins

  // Fetch the waste bins owned by the resident and total points from the backend
  useEffect(() => {
    if (resident && resident._id) {
      const fetchWasteBinsAndPoints = async () => {
        try {
          const wasteBinResponse = await axios.get(`http://localhost:2025/api/wastebin/${resident._id}`);
          setWasteBins(wasteBinResponse.data.wasteBins);

          const pointsResponse = await axios.get(`http://localhost:2025/api/resident/${resident.username}`,);
          setTotalPoints(pointsResponse.data.totalPoints);
        } catch (error) {
          console.error('Error fetching resident data:', error);
        }
      };

      fetchWasteBinsAndPoints();
    }
  }, [resident]);

  // Update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreetingMessage = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = format(currentTime, 'PPP');
  const formattedTime = format(currentTime, 'p');

  // Handle opening and closing of the dialog
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle search for available waste bins
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setBinID(query); // Update binID based on user input

    if (query.length > 1) {
      try {
        const response = await axios.get(`http://localhost:2025/api/wasteBin/search`, { params: { query } });
        setSearchResults(response.data.availableWasteBins); // Update search results
      } catch (error) {
        console.error('Error searching for available waste bins:', error);
      }
    } else {
      setSearchResults([]); // Clear search results if query is too short
    }
  };

  // Handle adding a new waste bin to the resident by updating the bin's owner
  const handleAddWasteBin = async (selectedBinID) => {
    try {
      const response = await axios.post(`http://localhost:2025/api/wasteBin/assignOwner`, {
        residentId: resident._id,
        binID: selectedBinID
      });

      // Fetch updated waste bins after successful assignment
      setWasteBins([...wasteBins, response.data.wasteBin]);
      toast.success('Waste bin added successfully!');
      setBinID('');
      setSearchResults([]);
      handleClose(); // Close the dialog after successful addition
    } catch (error) {
      console.error('Error adding waste bin:', error);
      toast.error('Failed to add waste bin');
    }
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Top Bar with Greeting, Date, and Time */}
      <AppBar position="static" sx={{ bgcolor: 'white', p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {getGreetingMessage()}, {resident ? resident.name : 'Guest'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {formattedDate} | {formattedTime}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {/* Display Total Points */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                height: 150,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#4caf50',
                padding: '20px',
                borderRadius: 2,
                color: '#fff',
              }}
            >
              <Typography variant="h4" align="center">
                Total Points: {totalPoints}
              </Typography>
            </Paper>
          </Grid>

          {/* Display Waste Bins */}
          <Grid item xs={12}>
            {wasteBins.length > 0 ? (
              <Grid container spacing={2}>
                {wasteBins.map((bin, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        height: 150,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'lightgreen',
                        backdropFilter: 'blur(5px)',
                        padding: '20px',
                      }}
                    >
                      <Typography variant="h5">Bin ID: {bin.binID}</Typography>
                      <Typography variant="h6">Type: {bin.binType}</Typography>
                      <Typography variant="h6">Weight: {bin.currentWeight} kg</Typography>
                      <Typography variant="h6">Max Capacity: {bin.maxWeight} kg</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  height: 150,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'lightgray',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">
                  No waste bins found. Click the + icon to add waste bins.
                </Typography>
                <IconButton onClick={handleClickOpen} color="primary" sx={{ ml: 2 }}>
                  <AddIcon />
                </IconButton>
              </Box>
            )}
          </Grid>

          {/* Button to Add More Waste Bins */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Add More Waste Bins
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for Adding New Waste Bin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a Waste Bin</DialogTitle>
        <DialogContent>
          <TextField
            label="Search Bin ID"
            value={binID}
            onChange={handleSearchChange}
            fullWidth
            margin="dense"
          />
          <List>
            {searchResults.map((bin) => (
              <ListItem button key={bin.binID} onClick={() => handleAddWasteBin(bin.binID)}>
                <ListItemText primary={`Bin ID: ${bin.binID} | Type: ${bin.binType}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer role="resident" />
    </div>
  );
};

export default ResidentHome;
