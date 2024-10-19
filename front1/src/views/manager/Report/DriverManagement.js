import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../../components/header';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);

  // Fetch all drivers when the component loads
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/employee'); // Assuming this fetches all employees including drivers
        const driverData = response.data; // Filter only drivers
        setDrivers(driverData);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Failed to load drivers');
      }
    };
    fetchDrivers();
  }, []);

  // Handle driver deletion
  const handleDeleteDriver = async (driverId) => {
    try {
      await axios.delete(`http://localhost:2025/api/employee/${driverId}`);
      setDrivers(drivers.filter(driver => driver._id !== driverId));
      toast.success('Driver deleted successfully');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Failed to delete driver');
    }
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Driver Management
        </Typography>

        {/* Driver Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Driver ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>{driver._id}</TableCell>
                  <TableCell>{driver.firstName} {driver.lastName}</TableCell>
                  <TableCell>{driver.email}</TableCell>
                  <TableCell>{driver.phoneNumber}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="secondary" onClick={() => handleDeleteDriver(driver._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="manager" />
    </div>
  );
};

export default DriverManagement;
