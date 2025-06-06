// src/components/Footer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Define a altura do footer como uma constante para ser reutilizada em App.tsx
export const FOOTER_HEIGHT = '50px'; // <-- Nova constante de altura

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000019',
        color: theme.palette.common.white,
        padding: theme.spacing(1), // Espaçamento interno menor para um footer fixo
        textAlign: 'center',
        width: '100%',
        height: FOOTER_HEIGHT, // <-- Altura fixa definida
        position: 'fixed', // <-- Torna o footer fixo na viewport
        bottom: 0, // <-- Alinha à parte inferior da viewport
        left: 0, // <-- Alinha à esquerda da viewport
        zIndex: theme.zIndex.appBar - 1, // <-- Garante que esteja acima do conteúdo, mas abaixo do AppBar (se ele fosse fixo também)
                                         // Um zIndex alto como 1000 também funcionaria
        boxShadow: '0 -2px 5px rgba(0,0,0,0.2)' // Opcional: uma leve sombra superior
      }}
    >
      <Typography variant="body2" sx={{ lineHeight: '32px' }}> {/* Ajusta o line-height para centralizar texto verticalmente se o padding não for suficiente */}
        &copy; {currentYear} StudyFlow. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;