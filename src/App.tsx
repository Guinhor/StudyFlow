// src/App.tsx

import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer'; // Importe o componente Footer

function App() {
  const location = useLocation();

  // Rotas onde o Header NÃO deve aparecer
  const noHeaderPaths = ['/', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  // Rotas onde o Footer NÃO deve aparecer
  // Adicionamos '/login' aqui. Você pode adicionar '/register' se quiser.
  const noFooterPaths = ['/', '/register'];
  const showFooter = !noFooterPaths.includes(location.pathname);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Container flex para o layout de altura total */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh', // Garante que ocupe a altura mínima da viewport
        }}
      >
        {showHeader && <Header />} {/* O Header só aparece em certas rotas */}

        {/* O Outlet renderiza o conteúdo da rota atual */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        {/* Renderiza o Footer apenas se showFooter for true */}
        {showFooter && <Footer />}
      </Box>
    </ThemeProvider>
  );
}

export default App;