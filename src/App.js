import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskQueue from './pages/TaskQueue';
import Patients from './pages/Patients';
import CompletedTasks from './pages/CompletedTasks';
import AddPatient from './pages/AddPatients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task-queue" element={<TaskQueue />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/completed-tasks" element={<CompletedTasks />} /> 
        <Route path="/add-patient" element={<AddPatient />} /> 
      </Routes>
    </Router>
  );
}

export default App;
