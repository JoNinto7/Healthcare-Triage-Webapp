import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Button, Modal, Box } from '@mui/material';
import './styles/background.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [averageWaitTime, setAverageWaitTime] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [taskDistribution, setTaskDistribution] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchMetrics();
    fetchAlerts();
  }, []);

  const fetchMetrics = async () => {
    try {
      const tasksResponse = await axios.get('http://localhost:5000/tasks');
      const completedTasksResponse = await axios.get('http://localhost:5000/completed-tasks');

      const fetchedTasks = tasksResponse.data;
      const fetchedCompletedTasks = completedTasksResponse.data;

      const totalWaitTime = fetchedTasks.reduce((sum, task) => sum + task.time, 0);
      const totalCost = fetchedTasks.reduce((sum, task) => sum + task.cost, 0);

      // Calculate task distribution by urgency level
      const distribution = fetchedTasks.reduce((acc, task) => {
        acc[task.urgency] = (acc[task.urgency] || 0) + 1;
        return acc;
      }, {});

      setTasks(fetchedTasks);
      setCompletedTasksCount(fetchedCompletedTasks.length);
      setAverageWaitTime((totalWaitTime / fetchedTasks.length).toFixed(2) || 0);
      setTotalCost(totalCost || 0);
      setTaskDistribution(distribution);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get('http://localhost:5000/alerts');
      setAlerts(response.data);
      setLoading(false); // Stop loading
    } catch (error) {
      setLoading(false); // Stop loading even on error
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await axios.get('http://localhost:5000/patients');
      const patient = response.data.find((p) => p['Patient ID'] === patientId);
      setSelectedPatient(patient);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Optimistic update: remove the task from alerts immediately
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== taskId));

      // Complete the specific task in the backend
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);

      // Fetch new alerts and metrics after the task is completed
      fetchAlerts();
      fetchMetrics();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          padding: '20px',
          marginTop: 64,
          boxSizing: 'border-box',
        }}
      >
        <h1>Healthcare Triage Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>
          <div>
            <h3>Completed Tasks</h3>
            <p>{completedTasksCount}</p>
          </div>
          <div>
            <h3>Average Wait Time</h3>
            <p>{averageWaitTime} minutes</p>
          </div>
          <div>
            <h3>Total Cost</h3>
            <p>${totalCost}</p>
          </div>
        </div>

        <h2>Task Distribution by Urgency</h2>
        <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
          {Object.keys(taskDistribution).map((urgency) => (
            <Grid item xs={12} sm={6} md={4} key={urgency}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="div">
                    Urgency Level {urgency}
                  </Typography>
                  <Typography>
                    Number of Patients: {taskDistribution[urgency]}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <h2>Alerts</h2>
        {loading ? (
          <Typography>Loading alerts...</Typography>
        ) : (
          <Grid container spacing={2}>
            {alerts.map((alert, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Patient ID: {alert.id}
                    </Typography>
                    <Typography>
                      <strong>Task Type:</strong> {alert.type}
                    </Typography>
                    <Typography>
                      <strong>Urgency Level:</strong> {alert.urgency}
                    </Typography>
                    <Typography>
                      <strong>Estimated Time:</strong> {alert.time} minutes
                    </Typography>
                    <Typography>
                      <strong>Cost:</strong> ${alert.cost}
                    </Typography>
                    <Typography>
                      <strong>Elapsed Time:</strong> {Math.floor((new Date() - new Date(alert.arrival)) / 60000)} minutes
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCompleteTask(alert.id)}
                      >
                        Mark as Completed
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => fetchPatientDetails(alert.id)}
                      >
                        View Patient Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Patient Details Modal */}
        <Modal
          open={!!selectedPatient}
          onClose={handleCloseModal}
          aria-labelledby="patient-details-title"
          aria-describedby="patient-details-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedPatient ? (
              <>
                <Typography id="patient-details-title" variant="h6" component="h2" gutterBottom>
                  Patient Details
                </Typography>
                <Typography id="patient-details-description" sx={{ mt: 2 }}>
                  <strong>Patient ID:</strong> {selectedPatient['Patient ID']} <br />
                  <strong>Name:</strong> {selectedPatient['Patient Name']} <br />
                  <strong>Age:</strong> {selectedPatient.Age} <br />
                  <strong>Condition:</strong> {selectedPatient['Emergency Type']} <br />
                  <strong>ESI Level:</strong> {selectedPatient['ESI Level']} <br />
                  <strong>Check-In Time:</strong> {selectedPatient['Patient Check-In Time']}
                </Typography>
                <Button
                  onClick={handleCloseModal}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, display: 'block', ml: 'auto', mr: 'auto' }}
                >
                  Close
                </Button>
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Box>
        </Modal>
      </main>
    </div>
  );
};

export default Dashboard;
