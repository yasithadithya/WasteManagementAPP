import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/header';

const EmployeeHome = () => {
  const employeeData = localStorage.getItem('employee');
  let employee = null;

  try {
    employee = employeeData ? JSON.parse(employeeData) : null;
  } catch (e) {
    console.error('Invalid employee data in localStorage', e);
    employee = null;
  }

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [wasteBins, setWasteBins] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch jobs assigned to the employee
  useEffect(() => {
    const fetchJobs = async () => {
      if (employee && employee._id) {
        try {
          const response = await axios.get(`http://localhost:2025/api/job`);
          const assignedJobs = response.data.jobs.filter(job => job.employee === employee._id && job.status !== 'Complete');
          setJobs(assignedJobs);
        } catch (error) {
          console.error('Error fetching jobs:', error);
          toast.error('Failed to load jobs');
        }
      }
    };
    fetchJobs();
  }, [employee]);

  // Open dialog and fetch waste bins for the selected job's resident
  const handleJobClick = async (job) => {
    try {
      setSelectedJob(job);
      const response = await axios.get(`http://localhost:2025/api/wastebin/${job.residentID}`);
      setWasteBins(response.data.wasteBins);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching waste bins:', error);
      toast.error('Failed to load waste bins');
    }
  };

  // Handle job completion (mark as "Complete")
  const handleCompleteCollection = async () => {
    try {
      // 1. Update job status to "Complete"
      await axios.put(`http://localhost:2025/api/job/${selectedJob._id}`, { status: 'Complete' });

      // 2. Reset current weight of all waste bins to zero
      const updatedBins = wasteBins.map(async (bin) => {
        return await axios.put(`http://localhost:2025/api/wastebin/weight/${bin.binID}/`, { newWeight: 0 });
      });

      // Wait for all waste bins to be updated
      await Promise.all(updatedBins);

      toast.success('Collection completed successfully!');

      // 3. Remove the job from the list
      setJobs(jobs.filter(job => job._id !== selectedJob._id));

      // 4. Close the dialog
      setOpenDialog(false);
    } catch (error) {
      console.error('Error completing collection:', error);
      toast.error('Failed to complete the collection');
    }
  };

  return (
    <div>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Assigned Jobs
        </Typography>

        {/* Job Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job ID</TableCell>
                <TableCell>Resident ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job._id}</TableCell>
                  <TableCell>{job.resident}</TableCell>
                  <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleJobClick(job)}>
                      View Waste Bins
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Waste Bin Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Waste Bins for Job {selectedJob?._id}</DialogTitle>
          <DialogContent>
            {wasteBins.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Bin ID</TableCell>
                      <TableCell>Bin Type</TableCell>
                      <TableCell>Current Weight (kg)</TableCell>
                      <TableCell>Max Weight (kg)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wasteBins.map((bin) => (
                      <TableRow key={bin._id}>
                        <TableCell>{bin.binID}</TableCell>
                        <TableCell>{bin.binType}</TableCell>
                        <TableCell>{bin.currentWeight}</TableCell>
                        <TableCell>{bin.maxWeight}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No waste bins found for this resident</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
            <Button onClick={handleCompleteCollection} variant="contained" color="success">
              Complete Collection
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer />
      </Container>
      <Footer role="employee" />
    </div>
  );
};

export default EmployeeHome;
