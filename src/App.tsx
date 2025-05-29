import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import Header from './components/Header';

function App() {
  const location = useLocation();
  
  const noHeaderPaths = ['/', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showHeader && <Header />}
      <Outlet />
    </ThemeProvider>
  );
}

export default App;