// src/components/NotificationPanel.js
import React from 'react';

const mockNotifications = [
  { id: 1, message: 'Patient P001 requires immediate attention!', type: 'critical' },
  { id: 2, message: 'New diagnostic test added for patient P002.', type: 'info' },
  { id: 3, message: 'Patient P004 has shown signs of improvement.', type: 'update' },
];

const NotificationPanel = () => {
  return (
    <div className="notification-panel">
      <h2>Notifications</h2>
      <ul>
        {mockNotifications.map((notification) => (
          <li key={notification.id} className={`notification ${notification.type}`}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
