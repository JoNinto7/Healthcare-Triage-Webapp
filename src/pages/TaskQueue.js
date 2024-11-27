import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import "./styles/background.css";
import "./styles/Table.css"; // Ensure Table.css is correctly imported

const TaskQueue = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
      setFilteredTasks(response.data); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      // Delete the specific task by ID
      const response = await axios.delete(
        `http://localhost:5000/tasks/${taskId}`
      );
      console.log("Task completed:", response.data.task);

      // Re-fetch tasks to update the UI
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleRowClick = async (patientId) => {
    try {
      const response = await axios.get("http://localhost:5000/patients");
      const patient = response.data.find((p) => p["Patient ID"] === patientId);
      setSelectedPatient(patient);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = tasks.filter(
      (task) =>
        task.id.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          padding: "20px",
          marginTop: 64,
          boxSizing: "border-box",
        }}
      >
        <h1>Task Queue</h1>

        {/* Search Bar */}
        <TextField
          label="Search by Patient ID or Task Type"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginBottom: 3 }}
        />

        {/* Styled Task Queue Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Task Type</th>
                <th>Urgency Level</th>
                <th>Estimated Time</th>
                <th>Cost</th>
                <th>Arrival Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(task.id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{task.id}</td>
                  <td>{task.type}</td>
                  <td>{task.urgency}</td>
                  <td>{task.time} minutes</td>
                  <td>${task.cost}</td>
                  <td>{task.arrival}</td>
                  <td style={{ textAlign: "center", padding: "8px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        handleCompleteTask(task.id);
                      }}
                      sx={{ padding: "4px 16px" }} // Adjust button padding
                    >
                      Complete Task
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
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "8px",
              boxShadow: 24,
              p: 4,
            }}
          >
            {selectedPatient ? (
              <>
                <Typography
                  id="patient-details-title"
                  variant="h6"
                  component="h2"
                  gutterBottom
                >
                  Patient Details
                </Typography>
                <Typography id="patient-details-description" sx={{ mt: 2 }}>
                  <strong>Patient ID:</strong> {selectedPatient["Patient ID"]}{" "}
                  <br />
                  <strong>Name:</strong> {selectedPatient["Patient Name"]}{" "}
                  <br />
                  <strong>Age:</strong> {selectedPatient.Age} <br />
                  <strong>Condition:</strong>{" "}
                  {selectedPatient["Emergency Type"]} <br />
                  <strong>ESI Level:</strong> {selectedPatient["ESI Level"]}{" "}
                  <br />
                  <strong>Check-In Time:</strong>{" "}
                  {selectedPatient["Patient Check-In Time"]}
                </Typography>
                <Button
                  onClick={handleCloseModal}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, display: "block", ml: "auto", mr: "auto" }}
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

export default TaskQueue;
