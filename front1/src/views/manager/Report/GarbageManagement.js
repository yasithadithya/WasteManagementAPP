import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button } from '@mui/material';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';

// Register chart.js elements
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const GarbageManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [residents, setResidents] = useState([]);
  const [types] = useState(['Organic', 'Plastic', 'Glass']); // Garbage types
  const [selectedResident, setSelectedResident] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all residents for the dropdown
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get('http://localhost:2025/api/resident/');
        setResidents(response.data);
      } catch (error) {
        console.error('Error fetching residents:', error);
      }
    };
    fetchResidents();
  }, []);

  // Fetch transactions based on the selected filters
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:2025/api/transaction', {
        params: {
          residentId: selectedResident,
          type: selectedType,
          startDate,
          endDate,
        },
      });
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Create chart data based on the transactions
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

      // Prepare chart datasets
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

      setChartData({
        labels: groupedData[0]?.data.map((item) => item.date) || [],
        datasets,
      });
    } else {
      setChartData(null); // Reset chart data if no transactions
    }
  }, [transactions, types]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Garbage Management
      </Typography>

      {/* Filter Section */}
      <div>
        <TextField
          select
          label="Select Resident"
          value={selectedResident}
          onChange={(e) => setSelectedResident(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
        >
          <MenuItem value="">All Residents</MenuItem> {/* Option for all residents */}
          {residents.map((resident) => (
            <MenuItem key={resident._id} value={resident._id}>
              {resident.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Select Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
        >
          <MenuItem value="">All Types</MenuItem> {/* Option for all garbage types */}
          {types.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ m: 1, width: '20ch' }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ m: 1, width: '20ch' }}
        />

        <Button variant="contained" color="primary" onClick={fetchTransactions} sx={{ m: 1 }}>
          Apply Filters
        </Button>
      </div>

      {/* Line Graph */}
      <div>
        {loading ? (
          <Typography variant="h6">Loading data...</Typography>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
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
          />
        ) : (
          <Typography variant="h6">No data available for the selected filters</Typography>
        )}
      </div>
    </Container>
  );
};

export default GarbageManagement;
