import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { format } from 'date-fns';
import { Header, Footer } from '../../components/header';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import AddIcon from '@mui/icons-material/Add'; // Plus icon for adding new waste bin
import axios from 'axios'; // For making HTTP requests
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

const ManagerHome = () => {
  const manager = JSON.parse(localStorage.getItem('manager'));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [residentCount, setResidentCount] = useState(0);
  const [wasteBinCount, setWasteBinCount] = useState(0);
  const [open, setOpen] = useState(false); // For opening the dialog to create new waste bin
  const [binType, setBinType] = useState(''); // For selecting waste bin type
  const [maxWeight, setMaxWeight] = useState(''); // For max capacity

  // Fetch the total number of residents from the backend
  useEffect(() => {
    const fetchResidentCount = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/resident/count');
        setResidentCount(response.data.count);
      } catch (error) {
        console.error('Error fetching resident count:', error);
      }
    };

    fetchResidentCount();
  }, []);

  // Fetch the total number of waste bins from the backend
  useEffect(() => {
    const fetchWasteBinCount = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/wasteBin/count');
        setWasteBinCount(response.data.totalWasteBins);
      } catch (error) {
        console.error('Error fetching waste bin count:', error);
      }
    };

    fetchWasteBinCount();
  }, []);

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

  // Handle waste bin creation
  const handleCreateWasteBin = async () => {
    if (!binType || !maxWeight) {
      toast.error("Please fill all fields"); // Show error toast if fields are empty
      return;
    }

    try {
      await axios.post('http://localhost:2025/api/wasteBin', { binType, maxWeight });
      setWasteBinCount(wasteBinCount + 1); // Update waste bin count
      toast.success('Waste bin created successfully!'); // Show success toast
      handleClose(); // Close the dialog after successful creation
    } catch (error) {
      console.error('Error creating waste bin:', error);
      toast.error('Failed to create waste bin'); // Show error toast
    }
  };

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Top Bar with Date and Time */}
      <AppBar position="static" sx={{ bgcolor: 'white', p: 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {getGreetingMessage()}, {manager.firstName}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            {formattedDate} | {formattedTime}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Swiper spaceBetween={30} slidesPerView={1} pagination={{ clickable: true }}>
              <SwiperSlide>
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
                  <Typography variant="h5">Total Residents: {residentCount}</Typography>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
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
                  <Typography variant="h5">Waste Bins: {wasteBinCount}</Typography>
                  <IconButton onClick={handleClickOpen} color="primary" sx={{ ml: 2 }}>
                    <AddIcon />
                  </IconButton>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
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
                  <Typography variant="h5">Total Jobs: 120</Typography>
                </Paper>
              </SwiperSlide>
              <SwiperSlide>
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
                  <Typography variant="h5">Total Drivers: 50</Typography>
                </Paper>
              </SwiperSlide>
            </Swiper>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog for Creating New Waste Bin */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Waste Bin</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Bin Type"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Organic">Organic</MenuItem>
            <MenuItem value="Plastic">Plastic</MenuItem>
            <MenuItem value="Glass">Glass</MenuItem>
          </TextField>
          <TextField
            label="Max Weight (kg)"
            value={maxWeight}
            onChange={(e) => setMaxWeight(e.target.value)}
            fullWidth
            margin="dense"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateWasteBin} color="primary">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer role="manager" />
    </div>
  );
};

export default ManagerHome;
