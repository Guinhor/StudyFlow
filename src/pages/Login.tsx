// src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/types'; // <-- Importante: Importar a interface 'User'
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Imports de Imagens ---
import backgroundImage from '../assets/background_login.png';
import logoImage from '../assets/logo2.png';
// --- Fim dos imports de imagens ---

// --- Styled Components ---
const LoginContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '400px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.shadows[3],
  borderRadius: 0,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: theme.spacing(4),
  color: theme.palette.primary.main,
  textAlign: 'center',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
}));

const DividerWithText = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    borderColor: theme.palette.divider,
  },
}));
// --- Fim dos Styled Components ---

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpa erros ao digitar
    if (name === 'email') {
      setEmailError(false);
      setEmailHelperText('');
    }
    if (name === 'password') {
      setPasswordError(false);
      setPasswordHelperText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.email);
    if (!isEmailValid) {
      setEmailError(true);
      setEmailHelperText('Por favor, insira um e-mail válido.');
      return;
    }

    // --- Lógica de validação de login (com tipagem 'User') ---
    const storedUsers = localStorage.getItem('users');
    // Carrega a lista de usuários, tipando-a como 'User[]'
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    // Procura o usuário que corresponde às credenciais, tipando-o como 'User | undefined'
    const foundUser: User | undefined = users.find(
      (user: User) => // O 'user' dentro do find também é tipado como 'User'
        user.email === formData.email && user.password === formData.password
    );

    if (foundUser) {
      // Login bem-sucedido: Armazenar o OBJETO COMPLETO do usuário logado no localStorage
      // A chave 'loggedInUser' armazenará o objeto 'User' completo
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      console.log('Login bem-sucedido!', foundUser);
      navigate('/home'); // Redireciona para a página Home
    } else {
      // Login falhou
      setEmailError(true);
      setPasswordError(true);
      setEmailHelperText('E-mail ou senha incorretos.');
      setPasswordHelperText('E-mail ou senha incorretos.');
      console.log('Falha no login: credenciais inválidas.');
      alert('E-mail ou senha incorretos. Tente novamente.'); // Feedback ao usuário
    }
    // --- Fim da lógica de validação de login ---
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
    }}>
      <Box sx={{
        flex: 1,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      <Box sx={{
        width: '400px',
        flexShrink: 0,
      }}>
        <form onSubmit={handleSubmit}>
          <LoginContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <img src={logoImage} alt="Logo StudyFlow" height="300" />
            </Box>

            <StyledTextField
              fullWidth
              name="email"
              label="E-mail"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              error={emailError}
              helperText={emailHelperText}
            />

            <StyledTextField
              fullWidth
              name="password"
              label="Senha"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              error={passwordError}
              helperText={passwordHelperText}
            />

            <LoginButton
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Login
            </LoginButton>

            <DividerWithText>ou</DividerWithText>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: '4px',
                fontWeight: 600,
              }}
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </Button>
          </LoginContainer>
        </form>
      </Box>
    </Box>
  );
};

export default Login;