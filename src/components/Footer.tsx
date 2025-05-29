// src/components/Footer.tsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer: React.FC = () => {
  const theme = useTheme(); // Para acessar as propriedades do tema, como espaçamento e paleta de cores

  // Obtém o ano atual dinamicamente
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer" // Indica que este Box é o footer semântico do HTML
      sx={{
        backgroundColor: '#000019', // Mesma cor de fundo do seu Header
        color: theme.palette.common.white, // Cor do texto branca
        padding: theme.spacing(3), // Espaçamento interno (3 * 8px = 24px padrão)
        textAlign: 'center', // Centraliza o texto
        mt: 'auto', // Empurra o footer para o final da página (ótimo para layouts flexbox)
        width: '100%', // Garante que o footer ocupe toda a largura
        flexShrink: 0, // Impede que o footer encolha em layouts flexbox
      }}
    >
      <Typography variant="body2">
        &copy; {currentYear} StudyFlow. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;