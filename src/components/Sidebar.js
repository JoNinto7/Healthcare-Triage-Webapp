import React from 'react';
import { Drawer, List, ListItem, ListItemText, AppBar, Typography, CssBaseline, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import logo from '../logo.png'; // Adjust the path based on your project structure

const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();

  // Function to determine if a page is active
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Typography variant="h6" noWrap component="div" sx={{ padding: '16px' }}>
          Healthcare Triage System
        </Typography>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensures footer stays at the bottom
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginY: '16px', // Add spacing only around the logo
          }}
        >
          <img
            src={logo}
            alt="Healthcare Logo"
            style={{
              maxWidth: '80%',
              height: 'auto',
              borderRadius: '8px', // Optional: Add rounded corners to the logo
            }}
          />
        </Box>
        {/* Navigation Items */}
        <div style={{ flexGrow: 1 }}>
          <List>
            {[
              { text: 'Dashboard', path: '/' },
              { text: 'Task Queue', path: '/task-queue' },
              { text: 'Patients', path: '/patients' },
              { text: 'Completed Tasks', path: '/completed-tasks' },
              { text: 'Add Patient', path: '/add-patient' },
            ].map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: '8px', // Rounded corners
                  backgroundColor: isActive(item.path) ? '#f8f9fa' : 'transparent', // Highlight active page
                  color: isActive(item.path) ? '#1976d2' : 'inherit', // Text color for active page
                  padding: isActive(item.path) ? '8px 16px' : '8px', // Add padding to active items
                  marginBottom: '8px', // Add spacing between items
                  '&:hover': {
                    backgroundColor: '#e3f2fd', // Lighter highlight on hover
                  },
                }}
              >
                <ListItemText
                  primary={item.text}
                  sx={{
                    textAlign: 'center', // Center-align text
                    fontWeight: isActive(item.path) ? 'bold' : 'normal', // Bold for active item
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            padding: '16px',
            fontSize: '12px',
            backgroundColor: '#f8f9fa', // Optional: Give it a distinct background color
            color: '#6c757d', // Optional: Adjust text color for visibility
          }}
        >
          Healthcare Triage System - A project by <br />
          JoNinto7
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
