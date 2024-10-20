import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import axios from 'axios';
import { Header, Footer } from '../../components/header';

// Register Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const ResidentReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [types] = useState(['Organic', 'Plastic', 'Glass']); // Garbage types
  const [selectedType, setSelectedType] = useState(''); // Selected garbage type
  const [startDate, setStartDate] = useState(''); // Selected start date
  const [endDate, setEndDate] = useState(''); // Selected end date
  const [chartData, setChartData] = useState(null); // Data for the chart
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the logged-in resident ID from localStorage or session (assumed to be stored after login)
  const loggedResidentId = localStorage.getItem('residentId'); // Replace with actual logic

  // Fetch the transactions for the logged-in resident
  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:2025/api/transaction/', {
        params: {
          id: loggedResidentId,
          binType: selectedType !== '' ? selectedType : undefined, // Only send type if selected
          startDate: startDate !== '' ? startDate : undefined, // Only send startDate if selected
          endDate: endDate !== '' ? endDate : undefined, // Only send endDate if selected
        },
      });

      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Prepare chart data whenever transactions are fetched or changed
  useEffect(() => {
    if (transactions.length > 0) {
      // Group transactions by binType
      const groupedData = types.map((type) => ({
        type,
        data: transactions
          .filter((transaction) => transaction.binType === type)
          .map((transaction) => ({
            date: new Date(transaction.timestamp).toLocaleDateString(),
            weight: transaction.currentWeight,
          })),
      }));

      // Prepare chart datasets for different garbage types
      const datasets = groupedData.map((group) => ({
        label: `${group.type} Garbage`,
        data: group.data.map((item) => item.weight),
        borderColor:
          group.type === 'Organic'
            ? 'green'
            : group.type === 'Plastic'
            ? 'red'
            : 'blue',
        fill: false,
        tension: 0.1,
      }));

      // Set chart data with date labels
      setChartData({
        labels: groupedData[0]?.data.map((item) => item.date) || [],
        datasets,
      });
    } else {
      setChartData(null); // Reset chart data if no transactions
    }
  }, [transactions, types]);

  return (
    <div>
      <Header />

      <Container>
        <Typography variant="h4" gutterBottom>
          My Garbage Production
        </Typography>

        {/* Filter Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Select Garbage Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              fullWidth
            >
              <MenuItem value="">All Types</MenuItem> {/* Option for all garbage types */}
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchTransactions}
              fullWidth
              sx={{ height: '100%' }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>

        {/* Responsive Line Graph */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {loading ? (
            <Typography variant="h6">Loading data...</Typography>
          ) : chartData ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false, // Allow the chart to resize dynamically
                scales: {
                  x: {
                    type: 'category',
                    title: {
                      display: true,
                      text: 'Date',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Weight (kg)',
                    },
                    beginAtZero: true,
                  },
                },
              }}
              height={400} // Height can dynamically adjust based on width and responsiveness
            />
          ) : (
            <Typography variant="h6">No data available for the selected filters</Typography>
          )}
        </div>
      </Container>

      <Footer role="resident" />
    </div>
  );
};

export default ResidentReport;
