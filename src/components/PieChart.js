// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Cardiac Emergencies', 'Trauma', 'Stroke', 'Minor Cuts', 'Others'],
    datasets: [
      {
        data: data, // Pass data as a prop
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
