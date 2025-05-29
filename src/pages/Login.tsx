import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import backgroundImage from '../assets/background_login.png'; // Caminho para sua imagem de fundo
import logoImage from '../assets/logo2.png'; // Caminho para sua imagem da logo
// --- Fim dos imports de imagens ---

// --- Styled Components ---
const LoginContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '400px',
  height: '100vh', // Ocupa a altura total da viewport
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Centraliza o conteúdo verticalmente
  boxShadow: theme.shadows[3],
  borderRadius: 0, // Sem bordas arredondadas para ocupar a lateral
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

  // --- Estados para o erro de validação do e-mail ---
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  // --- Fim dos estados de erro ---

  // --- Função de validação de e-mail ---
  const validateEmail = (email: string) => {
    // Regex simples para validação de e-mail. Para validações mais robustas, considere bibliotecas.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // --- Fim da função de validação ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validação em tempo real para o campo de e-mail
    if (name === 'email') {
      if (value === '') {
        setEmailError(false); // Remove o erro se o campo estiver vazio
        setEmailHelperText('');
      } else if (!validateEmail(value)) {
        setEmailError(true);
        setEmailHelperText('E-mail inválido');
      } else {
        setEmailError(false);
        setEmailHelperText('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validação final do e-mail antes de enviar ---
    const isEmailValid = validateEmail(formData.email);

    if (!isEmailValid) {
      setEmailError(true);
      setEmailHelperText('Por favor, insira um e-mail válido.');
      return; // Impede o envio do formulário se o e-mail for inválido
    }
    // --- Fim da validação final ---

    console.log('Login data:', formData);
    // Redireciona para a página 'home' após o login bem-sucedido
    navigate('/home'); 
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh', // Garante que a box principal ocupe toda a altura da viewport
    }}>
      {/* Box para a imagem de fundo (lado esquerdo) */}
      <Box sx={{
        flex: 1, // Ocupa o espaço restante
        backgroundImage: `url(${backgroundImage})`, // Usa a imagem importada
        backgroundSize: 'cover', // Garante que a imagem cubra toda a área
        backgroundPosition: 'center', // Centraliza a imagem
        backgroundRepeat: 'no-repeat', // Impede a repetição da imagem
      }} />

      {/* Box que contém o formulário de login (lado direito) */}
      <Box sx={{
        width: '400px', // Largura fixa para o formulário
        flexShrink: 0, // Não permite que esta box encolha
      }}>
        <form onSubmit={handleSubmit}>
          <LoginContainer>
            {/* --- Box para a logo --- */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
              <img src={logoImage} alt="Logo StudyFlow" height="300" /> {/* Usa a logo importada, ajuste a altura conforme necessário */}
            </Box>
            {/* --- Fim do Box da logo --- */}

            {/* Opcional: Se você quiser manter o texto 'StudyFlow' junto com a logo, descomente a linha abaixo */}
            {/* <LogoText>StudyFlow</LogoText> */}

            <StyledTextField
              fullWidth
              name="email"
              label="E-mail"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              // --- Propriedades de erro do Material UI para validação de e-mail ---
              error={emailError}
              helperText={emailHelperText}
              // --- Fim das propriedades de erro ---
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