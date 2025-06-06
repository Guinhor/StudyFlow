// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation pode ser removido se não houver uso futuro
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress, // <-- Importado CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { Project, User } from '../types/types'; // <-- CRUCIAL: Importar Project e User do types.ts

const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation(); // Comente ou remova se não for mais usar para location.state

  const [projects, setProjects] = useState<Project[]>([]); // Não inicializa mais do localStorage diretamente aqui
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // --- Estados para usuário logado e carregamento ---
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true enquanto carrega os dados
  // --- Fim dos novos estados ---

  // --- useEffect para carregar dados do usuário logado e projetos ---
  useEffect(() => {
    const storedLoggedInUser = localStorage.getItem('loggedInUser');
    if (storedLoggedInUser) {
      try {
        const user: User = JSON.parse(storedLoggedInUser);
        setLoggedInUser(user); // Define o usuário logado

        const storedProjects = localStorage.getItem('projects');
        if (storedProjects) {
          const allProjects: Project[] = JSON.parse(storedProjects);
          // --- FILTRAR PROJETOS PELO ID DO USUÁRIO LOGADO ---
          const filteredProjects = allProjects.filter(p => p.authorId === user.id);
          setProjects(filteredProjects); // Define os projetos do usuário logado
        } else {
          setProjects([]); // Nenhum projeto encontrado
        }
      } catch (e) {
        console.error("Erro ao parsear loggedInUser ou projetos no Home:", e);
        navigate('/'); // <-- Redireciona para /login (consistente com o App.tsx)
      }
    } else {
      navigate('/'); // <-- Redireciona para o login se não houver usuário logado
    }
    setLoading(false); // Conclui o carregamento, independentemente do sucesso
  }, [navigate]); // navigate como dependência

  // O useEffect abaixo foi removido (era do 'location.state' para newProject)
  // useEffect(() => {
  //   const newProject = location.state?.newProject;
  //   if (newProject) {
  //     const updatedProjects = [...projects, newProject];
  //     setProjects(updatedProjects);
  //     localStorage.setItem('projects', JSON.stringify(updatedProjects));
  //     window.history.replaceState({}, document.title);
  //   }
  // }, [location.state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento': return 'primary';
      case 'Concluído': return 'success';
      case 'Rascunho': return 'default';
      default: return 'default';
    }
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      // --- Lógica de exclusão que persiste no localStorage ---
      const stored = localStorage.getItem('projects');
      const allProjects: Project[] = stored ? JSON.parse(stored) : [];
      
      // Filtra TODOS os projetos para remover o que pertence ao usuário logado
      // E tem o ID correto (para não apagar projeto de outra pessoa)
      const updatedAllProjects = allProjects.filter((p) => p.id !== projectToDelete || p.authorId !== loggedInUser?.id);
      
      // Atualiza o localStorage com a lista completa de projetos
      localStorage.setItem('projects', JSON.stringify(updatedAllProjects));
      
      // Atualiza o estado local 'projects' que é filtrado para o usuário atual
      setProjects(updatedAllProjects.filter(p => p.authorId === loggedInUser?.id));
      // --- Fim da lógica de exclusão ---

      setOpenDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setProjectToDelete(null);
  };

  // --- Exibir estado de carregamento ---
  if (loading || !loggedInUser) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px - 50px)', // Altura da tela - Header - Footer
        flexDirection: 'column',
        p: 3
      }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" component="h1" gutterBottom>
          Carregando seus projetos...
        </Typography>
      </Box>
    );
  }

  // --- Conteúdo da página Home após carregamento ---
  return (
    <Box sx={{ flex: 1, p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Meus Projetos
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/new-project')}
          sx={{
            borderRadius: '20px',
            py: 1.5,
            px: 3,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          Novo Projeto
        </Button>
      </Box>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {projects.length > 0 ? (
          projects.map((project: Project) => (
            <div key={project.id}>
              <ProjectCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <StatusChip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />

                  <Typography gutterBottom variant="h5" component="h2">
                    {project.subject}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.summary}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: project.avatarColor,
                        width: 32,
                        height: 32,
                        mr: 1.5,
                      }}
                    >
                      {project.author.charAt(0)}
                    </Avatar>
                    <Typography variant="caption">
                      {project.author} • {project.updatedAt}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditProject(project.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(project.id)}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </ProjectCard>
            </div>
          ))
        ) : (
          // Renderiza 'null' quando não há projetos (texto "Nenhum projeto encontrado" foi removido)
          null
        )}
      </div>

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir este projeto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;