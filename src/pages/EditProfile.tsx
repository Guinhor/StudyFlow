import React, { useState, useEffect, useRef } from 'react'; // Importado useRef
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components ---
const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
}));

// Container para o Avatar (não precisa mais de 'position: relative' para o botão da câmera)
const AvatarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));
// --- Fim dos Styled Components ---

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  // Cria uma referência para o elemento input de arquivo HTML
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estados para dados do usuário (nome, email, telefone)
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Estados para nova senha e confirmação de senha
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // Estado para a URL da imagem de perfil (Base64 para exibição)
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  // Estado para o objeto File da imagem selecionada (para eventual upload em um backend real)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  // --- useEffect para carregar dados ao montar o componente ---
  useEffect(() => {
    // Carregar dados do usuário e foto de perfil do localStorage
    const storedUserData = localStorage.getItem('userData');
    const storedProfilePicture = localStorage.getItem('profilePicture');

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    if (storedProfilePicture) {
      // Se houver uma foto salva (Base64), define-a para exibição
      setProfilePicture(storedProfilePicture);
    }
  }, []); // Executa apenas uma vez ao montar o componente

  // --- Handlers de Mudança ---
  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Handler para quando um arquivo de imagem é selecionado
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Pega o primeiro arquivo selecionado
    if (file) {
      setProfilePictureFile(file); // Armazena o objeto File real
      const reader = new FileReader(); // Cria um FileReader para ler o conteúdo do arquivo

      reader.onloadend = () => {
        // Quando a leitura termina, define a imagem como uma URL Base64 para preview
        setProfilePicture(reader.result as string);
        console.log("EditProfile: Imagem Base64 gerada:", (reader.result as string).substring(0, 50) + '...');
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL Base64
    } else {
      setProfilePictureFile(null);
      setProfilePicture(null); // Limpa a pré-visualização se nenhum arquivo for selecionado
    }
  };

  // --- Handler para clicar no input de arquivo quando o Avatar é clicado ---
  const handleAvatarClick = () => {
    // Aciona o clique no input de arquivo oculto através da referência
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // --- Handler de Submissão do Formulário ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Em uma aplicação real, você faria validações aqui (ex: senhas batem)
    // E enviaria os dados para um backend para salvar.

    console.log('Dados atualizados:', { ...userData, ...passwordData, profilePictureFile });

    // Salva os dados do usuário no localStorage
    localStorage.setItem('userData', JSON.stringify(userData));

    // Salva a imagem de perfil (Base64) no localStorage, se existir
    if (profilePicture) {
      localStorage.setItem('profilePicture', profilePicture);
      console.log('EditProfile: Foto de perfil salva no localStorage.');
    } else {
      // Se a imagem foi removida, também remove do localStorage
      localStorage.removeItem('profilePicture');
      console.log('EditProfile: Foto de perfil removida do localStorage.');
    }

    // --- PONTO CRÍTICO: DISPARAR UM EVENTO CUSTOMIZADO PARA ATUALIZAR OUTROS COMPONENTES ---
    // Este evento notifica componentes como o Header que os dados do perfil foram atualizados.
    window.dispatchEvent(new CustomEvent('profileUpdate'));
    console.log("EditProfile: Evento 'profileUpdate' disparado para atualizar o Header.");

    // Navega para a página Home após salvar
    navigate('/home');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Perfil
        </Typography>

        <ProfileContainer>
          <AvatarContainer>
            {/* Box que torna o Avatar clicável */}
            <Box onClick={handleAvatarClick} sx={{ cursor: 'pointer' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                }}
                src={profilePicture || undefined} // Usa a URL Base64 como fonte
                alt="Foto de perfil" // Texto alternativo para acessibilidade
              >
                {/* Exibe a primeira letra do nome se não houver foto de perfil */}
                {!profilePicture && userData.fullName ? userData.fullName.charAt(0).toUpperCase() : ''}
              </Avatar>
            </Box>

            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef} // Associa a referência ao input
              accept="image/*" // Aceita apenas arquivos de imagem
              style={{ display: 'none' }} // Esconde o input padrão do navegador
              id="profile-picture-upload" // ID (ainda pode ser útil para acessibilidade, mesmo sem label direto)
              type="file"
              onChange={handleProfilePictureChange}
            />
          </AvatarContainer>

          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Informações Pessoais
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              label="Nome Completo"
              name="fullName"
              value={userData.fullName}
              onChange={handleUserDataChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              onChange={handleUserDataChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="phone"
              value={userData.phone}
              onChange={handleUserDataChange}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Alterar Senha
            </Typography>

            <TextField
              fullWidth
              margin="normal"
              label="Nova Senha"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/home')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                Salvar Alterações
              </Button>
            </Box>
          </form>
        </ProfileContainer>
      </Box>
    </Container>
  );
};

export default EditProfile;