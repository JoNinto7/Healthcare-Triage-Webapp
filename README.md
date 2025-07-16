# Healthcare Triage Webapp

A healthcare task prioritization and triage system built using a React frontend and an Express.js backend. The system dynamically prioritizes patient care tasks based on urgency, cost, and time to improve healthcare efficiency and reduce patient wait times.

## Features

### Frontend
- Built with React for a modern and interactive user interface.
- Displays real-time prioritized task queues for healthcare providers.
- Provides visual alerts for overdue tasks.

### Backend
- Built with Node.js and Express.js.
- Utilizes a MinHeap data structure for task prioritization based on urgency.
- Manages tasks using a synthetic healthcare dataset (`Synthetic_Dataset_TriageSystem.csv`).
- Calculates:
  - **Cost**: Based on emergency type and urgency.
  - **Estimated Time**: For task completion.
  - **Alerts**: For overdue tasks based on thresholds.
- RESTful API endpoints for managing tasks and patient data.

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/healthcare-triage-webapp.git -b main

   cd healthcare-triage-webapp
   ```

2. Install backend dependencies:
   ```bash
   cd healthcare-triage-webapp\backend
   
   npm i express cors body-parser csv-parser csv-writer
   ```

3. Install frontend dependencies:
   ```bash
   cd healthcare-triage-webapp\src

   npm i react react-dom @mui/material @mui/icons-material axios  
    ```

### Running the Application

#### Start the Backend:
1. Run the server:
   ```bash
   node server.js
   ```
#### Start the Frontend:
1. Start the React development server: 
   
   ```bash
   npm start
   ```
#### Access the Application
- **Frontend**: Open your browser and navigate to `http://localhost:3000`.
- **Backend API**: Access API endpoints at `http://localhost:5000`.

## API Endpoints

### Task Management
- **GET** `/tasks`: Retrieve all tasks in the priority queue.
- **DELETE** `/tasks/:id`: Mark a task as completed.

### Alerts
- **GET** `/alerts`: Retrieve top 5 overdue tasks.

### Dataset
- **GET** `/patients`: Retrieve the patient dataset.
- **POST** `/add-patient`: Add a new patient to the dataset.

### Completed Tasks
- **GET** `/completed-tasks`: Retrieve completed tasks.

## File Structure

### Frontend
- **public/**: Static files (e.g., `index.html`).
- **src/**: React components and app logic.

### Backend
- **server.js**: Main server file.
- **heap.js**: MinHeap implementation for prioritization.
- **Synthetic_Dataset_TriageSystem.csv**: Synthetic dataset for patients.

## Technologies Used

### Frontend
- React
- CSS for styling

### Backend
- Node.js
- Express.js
- MinHeap (Custom implementation)

### Utilities
- `csv-parser` and `csv-writer` for CSV handling
- CORS for frontend-backend communication

## Future Enhancements
- Implement user authentication and role-based access.
- Add analytics dashboards for patient and task data.
- Enable real-time updates using WebSocket.
- Deploy the application to a cloud platform (e.g., AWS, Azure).

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
