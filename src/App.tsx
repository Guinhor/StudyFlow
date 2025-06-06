// src/App.tsx

import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './styles/theme';
import Header from './components/Header';
import Footer, { FOOTER_HEIGHT } from './components/Footer'; // Importe FOOTER_HEIGHT

function App() {
  const location = useLocation();

  const noHeaderPaths = ['/', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  const noFooterPaths = ['/', '/register'];
  const showFooter = !noFooterPaths.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          // Se o Header também fosse fixo, adicionaríamos um paddingTop aqui:
          // paddingTop: showHeader ? '64px' : 0, // Assumindo Header height de 64px
        }}
      >
        {showHeader && <Header />}

        {/*
          O Outlet renderiza o conteúdo da rota atual.
          Adicionamos paddingBottom para que o conteúdo não seja coberto pelo footer fixo.
        */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Faz com que o conteúdo principal ocupe o máximo de espaço
            paddingBottom: showFooter ? FOOTER_HEIGHT : 0, // <-- AQUI! Adiciona o padding
            // Se o Header também fosse fixo, adicionaríamos padding para ele:
            // paddingTop: showHeader ? '64px' : 0,
          }}
        >
          <Outlet />
        </Box>

        {showFooter && <Footer />}
      </Box>
    </ThemeProvider>
  );
}

export default App;