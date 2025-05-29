// src/components/Header.tsx

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar, Button } from '@mui/material'; // 'Button' ainda importado, mas não usado diretamente para o logout
import { AccountCircle } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout'; // Ícone de Logout importado
import { useNavigate } from 'react-router-dom';

import logoImage from '../assets/logo3.png'; // Caminho para a imagem da sua logo

const Header = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');

  // Função para carregar a foto e a inicial do usuário do localStorage
  const loadProfileData = () => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    const storedUserData = localStorage.getItem('userData');

    // DEBUG: Verifique o que está sendo lido
    console.log('Header - Carregando dados:');
    console.log('  storedProfilePicture:', storedProfilePicture ? storedProfilePicture.substring(0, 50) + '...' : null);
    console.log('  storedUserData:', storedUserData);


    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    } else {
      setProfilePicture(null); // Garante que não haja foto antiga se a nova for removida
    }

    if (storedUserData) {
      try {
        const userDataParsed = JSON.parse(storedUserData);
        if (userDataParsed.fullName) {
          setUserInitial(userDataParsed.fullName.charAt(0).toUpperCase());
        } else {
          setUserInitial('');
        }
      } catch (e) {
        console.error('Header: Erro ao parsear userData do localStorage', e);
        setUserInitial('');
      }
    } else {
      setUserInitial('');
    }
  };

  // useEffect para carregar dados na montagem e ouvir eventos de atualização
  useEffect(() => {
    loadProfileData(); // Carrega os dados na montagem inicial do componente

    // Handler do evento customizado 'profileUpdate'
    const handleProfileUpdate = () => {
      console.log('Header: Evento "profileUpdate" recebido! Recarregando dados...');
      loadProfileData(); // Rerecarrega os dados do localStorage quando o evento é disparado
    };

    // Adiciona o ouvinte do evento customizado na janela global
    window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);

    // Função de limpeza: remove o ouvinte ao desmontar o componente
    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
    };
  }, []);

  // Função para lidar com o Logout
  const handleLogout = () => {
    // Limpa os dados do usuário e de projetos do localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('projects'); // Remova esta linha se os projetos não devem ser limpos no logout

    // Redireciona o usuário para a tela de login (que é a rota '/')
    navigate('/login');
    console.log("Usuário deslogado. Dados do localStorage limpos.");
  };

  return (
    <AppBar
      position="static" // Permanece no topo da página ao rolar
      sx={{
        backgroundColor: '#000019', // Cor de fundo do cabeçalho
        height: '64px', // Altura fixa para o cabeçalho
        minHeight: '64px', // Garante que a altura mínima também seja respeitada
      }}
    >
      <Toolbar
        sx={{
          height: '100%', // Faz com que a Toolbar ocupe toda a altura do AppBar
          minHeight: 'auto', // Sobrescreve o min-height padrão da Toolbar para se ajustar ao AppBar
        }}
      >
        {/* Ícone da Logo - Clicável para navegar para a Home */}
        <IconButton
          edge="start" // Alinha à esquerda da Toolbar
          color="inherit" // Herda a cor do AppBar
          aria-label="home" // Rótulo para acessibilidade
          sx={{ mr: 2 }} // Margem à direita
          onClick={() => navigate('/home')} // Navega para a Home ao clicar
        >
          <img
            src={logoImage} // Fonte da imagem da logo
            alt="StudyFlow Logo" // Texto alternativo para acessibilidade
            style={{
              height: 'auto',
              width: '200px',
              maxHeight: '100%',
            }}
          />
        </IconButton>

        {/* Ícone de usuário no canto direito */}
        <IconButton
          color="inherit"
          onClick={() => navigate('/edit-profile')}
          sx={{ ml: 'auto' }} // Empurra o ícone do usuário (e o de Logout que vem depois) para a direita
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={profilePicture || undefined}
            onError={(e) => {
              console.error("Erro ao carregar a imagem de perfil no Header:", e);
              setProfilePicture(null);
            }}
          >
            {userInitial || <AccountCircle />}
          </Avatar>
        </IconButton>

        {/* --- Ícone de Logout (apenas ícone) --- */}
        <IconButton
          color="inherit"
          onClick={handleLogout}
          sx={{ ml: 1 }} // Margem à esquerda para separar do ícone do usuário
          aria-label="logout" // Rótulo para acessibilidade
        >
          <LogoutIcon /> {/* O ícone de Logout */}
        </IconButton>
        {/* --- Fim do Ícone de Logout --- */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;