import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Container, Typography, Autocomplete, TextField, Button, Grid } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [residentId, setResidentId] = useState('');  // Selected resident ID from autocomplete
  const [residentOptions, setResidentOptions] = useState([]);  // Options for resident autocomplete

  // Function to calculate total weight by bin type
  const calculateTotalWeightByType = (transactions) => {
    const totalWeightByType = {};

    transactions.forEach((transaction) => {
      const { binType, currentWeight } = transaction;
      if (!totalWeightByType[binType]) {
        totalWeightByType[binType] = 0;
      }
      totalWeightByType[binType] += currentWeight;  // Sum currentWeight for each binType
    });

    return totalWeightByType;
  };

  // Fetch waste bin transactions and calculate total weight by type
  const fetchWasteData = async (residentId = '') => {
    try {
      let url = 'http://localhost:2025/api/transaction/';
      if (residentId) {
        url += `?residentId=${residentId}`; // Assuming API supports filtering by resident ID
      }

      const response = await axios.get(url);
      const transactions = response.data;  // Array of waste transactions

      const totalWeightByType = calculateTotalWeightByType(transactions);

      const labels = Object.keys(totalWeightByType); // Garbage types (e.g., Organic, Plastic)
      const weights = Object.values(totalWeightByType); // Corresponding weights

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Total Weight (kg)',
            data: weights,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching waste transaction data', error);
    }
  };

  // Fetch all resident options for the autocomplete dropdown
  const fetchResidentOptions = async () => {
    try {
      const response = await axios.get('http://localhost:2025/api/resident/'); // Assuming the API returns all residents
      const residents = response.data; // Array of resident objects
      setResidentOptions(residents.map((resident) => ({ label: resident.name, id: resident._id })));  // Use resident names for autocomplete
    } catch (error) {
      console.error('Error fetching resident options', error);
    }
  };

  // Fetch resident options when the component mounts
  useEffect(() => {
    fetchResidentOptions(); // Fetch all residents on component load
    fetchWasteData(); // Fetch initial waste data without filtering
  }, []);

  // Handle search input change and set selected resident ID
  const handleSearchChange = (event, value) => {
    if (value) {
      setResidentId(value.id);  // Set the selected resident ID
    } else {
      setResidentId('');  // Reset resident ID if no value is selected
    }
  };

  // Handle the search functionality
  const handleSearch = () => {
    if (residentId) {
      fetchWasteData(residentId); // Fetch data for the specific resident
    } else {
      toast.error('Please select a resident to view data.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Total Garbage by Resident
      </Typography>

      {/* Search Field for Resident with Autocomplete */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Autocomplete
            options={residentOptions}
            getOptionLabel={(option) => option.label || ''}  // Display the resident's name
            onChange={handleSearchChange}
            renderInput={(params) => (
              <TextField {...params} label="Select Resident" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Bar Chart */}
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Total Garbage by Type (kg)'
            }
          }
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </Container>
  );
};

export default WasteBarChart;
