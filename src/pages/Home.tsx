import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface Project {
  id: string;
  subject: string;
  status: string;
  summary: string;
  author: string;
  updatedAt: string;
  avatarColor: string;
}

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
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>(() => {
    const stored = localStorage.getItem('projects');
    return stored ? JSON.parse(stored) : [];
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    const newProject = location.state?.newProject;
    if (newProject) {
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      const updated = projects.filter((p) => p.id !== projectToDelete);
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
      setOpenDeleteDialog(false);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setProjectToDelete(null);
  };

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
        {projects.map((project: Project) => (
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
        ))}
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