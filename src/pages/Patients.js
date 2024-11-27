import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import './styles/background.css';
import './styles/Table.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/patients');
      setPatients(response.data);
      setFilteredPatients(response.data); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = patients.filter(
      (patient) =>
        patient['Patient ID'].toLowerCase().includes(query) ||
        patient['Patient Name'].toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
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
        <h1>Patients</h1>

        {/* Search Bar */}
        <TextField
          label="Search by Patient ID or Name"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 3 }}
        />

        {/* Patients Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <tr key={index}>
                  <td>{patient['Patient ID']}</td>
                  <td>{patient['Patient Name']}</td>
                  <td>{patient.Age}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(patient)}
                    >
                      View All Patient Details
                    </Button>
                  </td>
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
                  Full Patient Details
                </Typography>
                <Box
                  sx={{
                    maxHeight: 300, // Limit the height of the scrollable area
                    overflowY: 'auto', // Add vertical scrolling
                    marginTop: 2,
                    paddingRight: 1,
                  }}
                >
                  {Object.entries(selectedPatient).map(([key, value]) => (
                    <Typography key={key} sx={{ marginBottom: 1 }}>
                      <strong>{key}:</strong> {value}
                    </Typography>
                  ))}
                </Box>
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

export default Patients;