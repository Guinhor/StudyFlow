// src/components/Footer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// --- VERIFIQUE ESTA LINHA ---
export const FOOTER_HEIGHT = '50px'; // <-- Esta linha deve estar aqui!
// --- FIM DA VERIFICAÇÃO ---

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000019',
        color: theme.palette.common.white,
        padding: theme.spacing(1),
        textAlign: 'center',
        width: '100%',
        height: FOOTER_HEIGHT,
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: theme.zIndex.appBar - 1,
        boxShadow: '0 -2px 5px rgba(0,0,0,0.2)'
      }}
    >
      <Typography variant="body2" sx={{ lineHeight: '32px' }}>
        &copy; {currentYear} StudyFlow. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;