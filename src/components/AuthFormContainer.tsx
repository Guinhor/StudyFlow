import React from 'react';
import { Paper, Box } from '@mui/material';

interface AuthFormContainerProps {
  children: React.ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthFormContainer;