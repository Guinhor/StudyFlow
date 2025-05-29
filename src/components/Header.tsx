// src/components/Header.tsx

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, IconButton, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import logoImage from '../assets/logo3.png';

const Header = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');

  // Função para carregar a foto e inicial do usuário do localStorage
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
      setProfilePicture(null);
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

  useEffect(() => {
    loadProfileData(); // Carrega os dados na montagem inicial

    // Handler do evento customizado
    const handleProfileUpdate = () => {
      console.log('Header: Evento "profileUpdate" recebido! Recarregando dados...');
      loadProfileData(); // Rerecarrega os dados do localStorage
    };

    // --- PONTO CRÍTICO: ADICIONAR O OUVINTE DO EVENTO ---
    // Assegura que o tipo de função está correto para o addEventListener
    window.addEventListener('profileUpdate', handleProfileUpdate as EventListener);

    return () => {
      // Limpa o ouvinte ao desmontar o componente para evitar vazamento de memória
      window.removeEventListener('profileUpdate', handleProfileUpdate as EventListener);
    };
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem/desmontagem

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#000019',
        height: '64px',
        minHeight: '64px',
      }}
    >
      <Toolbar
        sx={{
          height: '100%',
          minHeight: 'auto',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          sx={{ mr: 2 }}
          onClick={() => navigate('/home')}
        >
          <img
            src={logoImage}
            alt="StudyFlow Logo"
            style={{
              height: 'auto',
              width: '200px',
              maxHeight: '100%',
            }}
          />
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() => navigate('/edit-profile')}
          sx={{ ml: 'auto' }}
        >
          <Avatar
            sx={{ width: 32, height: 32 }}
            src={profilePicture || undefined} // Usa a imagem Base64 como src
            onError={(e) => {
              // Este callback é acionado se a imagem definida em 'src' falhar ao carregar.
              console.error("Erro ao carregar a imagem de perfil no Header:", e);
              // Força a exibição da inicial ou do ícone padrão
              setProfilePicture(null); // Limpa o src para que o children seja renderizado
            }}
          >
            {/* Exibe a inicial do nome OU o ícone AccountCircle se não houver foto válida/carregável */}
            {userInitial || <AccountCircle />}
          </Avatar>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;