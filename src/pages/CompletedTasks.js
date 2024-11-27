import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import './styles/background.css';
import './styles/Table.css'; // Ensure Table.css is correctly imported

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/completed-tasks');
      setCompletedTasks(response.data);
      setFilteredTasks(response.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
    }
  };

  const fetchPatientDetails = async (patientId) => {
    try {
      const response = await axios.get('http://localhost:5000/patients');
      const patient = response.data.find((p) => p['Patient ID'] === patientId);
      setSelectedPatient({
        'Patient ID': patient['Patient ID'],
        'Patient Name': patient['Patient Name'],
        Age: patient.Age,
        Condition: patient['Emergency Type'],
        'ESI Level': patient['ESI Level'],
        'Check-In Time': patient['Patient Check-In Time'],
      });
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  const handleRowClick = (patientId) => {
    fetchPatientDetails(patientId);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = completedTasks.filter(
      (task) =>
        task.id.toLowerCase().includes(query) || task.type.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
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
        <h1>Completed Tasks</h1>

        {/* Search Bar */}
        <TextField
          label="Search by Patient ID or Task Type"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 3 }}
        />

        {/* Styled Completed Tasks Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Task Type</th>
                <th>Urgency Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(task.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{task.id}</td>
                  <td>{task.type}</td>
                  <td>{task.urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                  <strong>Condition:</strong> {selectedPatient.Condition} <br />
                  <strong>ESI Level:</strong> {selectedPatient['ESI Level']} <br />
                  <strong>Check-In Time:</strong> {selectedPatient['Check-In Time']}
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

export default CompletedTasks;
