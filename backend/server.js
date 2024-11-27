const fs = require('fs');
const csv = require('csv-parser');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MinHeap } = require('./heap');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const dataset = [];
const taskQueue = new MinHeap();
const completedTasks = []; // Array to track completed tasks

const csvFilePath = 'Syntheic_Dataset_TriageSystem.csv';

// Function to calculate balanced cost
const calculateCost = (emergencyType, urgency) => {
  const baseCosts = {
    'Cardiac Emergency': 2000,
    'Respiratory Emergency': 1500,
    Stroke: 2500,
    'Severe Infection': 1800,
    'Minor Injury': 500,
  };

  const urgencyMultiplier = {
    1: 1.5, // Highest urgency
    2: 1.3,
    3: 1.1,
    4: 1.0,
    5: 0.8, // Lowest urgency
  };

  const baseCost = baseCosts[emergencyType] || 1000; // Default cost if type is missing
  const multiplier = urgencyMultiplier[urgency] || 1.0;

  return Math.round(baseCost * multiplier);
};

// Function to generate estimated time based on urgency
const generateTime = (urgency) => {
  const timeRanges = {
    1: [10, 20],
    2: [20, 30],
    3: [30, 40],
    4: [40, 50],
    5: [50, 60],
  };

  const [min, max] = timeRanges[urgency] || [30, 60]; // Default range if urgency is invalid
  return Math.floor(Math.random() * (max - min + 1)) + min; // Random time within the range
};

// Function to calculate elapsed time since arrival
const calculateElapsedTime = (arrivalTime) => {
  const arrival = new Date(arrivalTime);
  const now = new Date();
  return Math.floor((now - arrival) / 60000); // Convert milliseconds to minutes
};

// Alert thresholds based on urgency levels
const alertThresholds = {
  1: 10, // Urgency Level 1: 10 minutes
  2: 20, // Urgency Level 2: 20 minutes
  3: 30, // Urgency Level 3: 30 minutes
  4: 40, // Urgency Level 4: 40 minutes
  5: 50, // Urgency Level 5: 50 minutes
};

// Load CSV dataset
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    dataset.push(row);

    // Include all urgency levels (1-5)
    const urgency = parseInt(row['ESI Level']);
    const cost = calculateCost(row['Emergency Type'], urgency);
    const time = generateTime(urgency);

    taskQueue.insert({
      id: row['Patient ID'],
      type: row['Emergency Type'],
      urgency: urgency,
      time: time,
      cost: cost,
      arrival: row['Patient Check-In Time'],
    });
  })
  .on('end', () => {
    console.log('CSV file successfully loaded.');
  });

// Serve tasks from heap
app.get('/tasks', (req, res) => {
  res.json(taskQueue.getHeap());
});

// Complete (remove) a specific task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const heap = taskQueue.getHeap();
  const taskIndex = heap.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    // Remove the task from the heap
    const [completedTask] = heap.splice(taskIndex, 1);
    completedTasks.push(completedTask);
    taskQueue.heapify();
    res.json({ message: 'Task completed', task: completedTask });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Serve patient dataset
app.get('/patients', (req, res) => {
  res.json(dataset);
});

// Serve completed tasks
app.get('/completed-tasks', (req, res) => {
  res.json(completedTasks);
});

// Serve alerts based on elapsed time and urgency
app.get('/alerts', (req, res) => {
  const alerts = taskQueue
    .getHeap()
    .filter((task) => {
      const elapsedTime = calculateElapsedTime(task.arrival);
      return elapsedTime > alertThresholds[task.urgency];
    })
    .sort((a, b) => a.urgency - b.urgency || calculateElapsedTime(b.arrival) - calculateElapsedTime(a.arrival))
    .slice(0, 5);

  res.json(alerts);
});

// Endpoint to add a new patient
app.post('/add-patient', (req, res) => {
  const newPatient = req.body;

  // Validate input
  if (!newPatient['Patient ID'] || !newPatient['Patient Name']) {
    return res.status(400).json({ message: 'Patient ID and Name are required.' });
  }

  // Append to CSV
  const csvWriter = createCsvWriter({
    path: csvFilePath,
    append: true,
    header: Object.keys(newPatient).map((key) => ({ id: key, title: key })),
  });

  csvWriter
    .writeRecords([newPatient])
    .then(() => {
      dataset.push(newPatient); // Update in-memory dataset
      res.status(200).json({ message: 'Patient added successfully.' });
    })
    .catch((error) => {
      console.error('Error writing to CSV:', error);
      res.status(500).json({ message: 'Error adding patient.' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
