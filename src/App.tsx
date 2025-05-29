// src/App.tsx

import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material'; // Importado Box
import theme from './styles/theme';
import Header from './components/Header';
import Footer from './components/Footer'; // Importe o componente Footer

function App() {
  const location = useLocation();

  const noHeaderPaths = ['/login', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  // --- Ajustes para o layout do Footer "grudar" na parte inferior ---
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
        <Box component="main" sx={{ flexGrow: 1 }}> {/* Faz o conteúdo principal preencher o espaço */}
          <Outlet />
        </Box>

        <Footer /> {/* Adicione o Footer aqui */}
      </Box>
    </ThemeProvider>
  );
}

export default App;