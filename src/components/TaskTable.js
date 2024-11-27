import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  return (
    <div>
      <h2>Task Queue</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Task Type</th>
            <th>Urgency Level</th>
            <th>Estimated Time</th>
            <th>Cost</th>
            <th>Arrival Time</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.id}</td>
              <td>{task.type}</td>
              <td>{task.urgency}</td>
              <td>{task.time}</td>
              <td>{task.cost}</td>
              <td>{task.arrival}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
