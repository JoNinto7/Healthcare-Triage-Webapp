import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    'Patient ID': '',
    'Patient Name': '',
    Sex: '',
    'Emergency Type': '',
    'ESI Level': '',
    'Heart Rate': '',
    'Blood Pressure': '',
    'Respiratory Rate': '',
    'Oxygen Levels (%)': '',
    'Consciousness Score (GCS)': '',
    'Signs of Distress': '',
    'Signs of Bleeding/Shock': '',
    'Potential for Deterioration': '',
    Phone: '',
    'Marital Status': '',
    Address: '',
    Children: '',
    Spouse: '',
    'Insurance Status': '',
    'Insurance Provider': '',
    Smoker: '',
    'Non-Alcoholic': '',
    'Pain Level (1-10)': '',
    'Mobility Status': '',
    'Cognitive State': '',
    Age: '',
    'Temperature (°F)': '',
    'Recent Hospital Visits (Past 6 Months)': '',
    'Patient Check-In Time': '',
    'Insurance Category': '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/add-patient', formData);
      setResponseMessage(response.data.message);
      // Reset form fields
      setFormData({
        'Patient ID': '',
        'Patient Name': '',
        Sex: '',
        'Emergency Type': '',
        'ESI Level': '',
        'Heart Rate': '',
        'Blood Pressure': '',
        'Respiratory Rate': '',
        'Oxygen Levels (%)': '',
        'Consciousness Score (GCS)': '',
        'Signs of Distress': '',
        'Signs of Bleeding/Shock': '',
        'Potential for Deterioration': '',
        Phone: '',
        'Marital Status': '',
        Address: '',
        Children: '',
        Spouse: '',
        'Insurance Status': '',
        'Insurance Provider': '',
        Smoker: '',
        'Non-Alcoholic': '',
        'Pain Level (1-10)': '',
        'Mobility Status': '',
        'Cognitive State': '',
        Age: '',
        'Temperature (°F)': '',
        'Recent Hospital Visits (Past 6 Months)': '',
        'Patient Check-In Time': '',
        'Insurance Category': '',
      });
    } catch (error) {
      console.error('Error adding patient:', error);
      setResponseMessage('Failed to add patient.');
    }
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '30px',
            maxWidth: '800px',
            width: '100%',
            borderRadius: '8px',
            backgroundColor: 'white',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Add New Patient
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
          >
            <Grid container spacing={2}>
              {Object.keys(formData).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                display: 'block',
                ml: 'auto',
                mr: 'auto',
                width: '150px',
              }}
            >
              Add Patient
            </Button>
          </Box>
          {responseMessage && (
            <Typography variant="body1" align="center" color="green" sx={{ mt: 2 }}>
              {responseMessage}
            </Typography>
          )}
        </Paper>
      </main>
    </div>
  );
};

export default AddPatient;
