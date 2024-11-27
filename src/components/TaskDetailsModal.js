// src/components/TaskDetailsModal.js
import React from 'react';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Details</h2>
        <p><strong>Patient ID:</strong> {task.id}</p>
        <p><strong>Task Type:</strong> {task.type}</p>
        <p><strong>Urgency Level:</strong> {task.urgency}</p>
        <p><strong>Estimated Time:</strong> {task.time} minutes</p>
        <p><strong>Cost:</strong> ${task.cost}</p>
        <p><strong>Arrival Time:</strong> {task.arrival}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;