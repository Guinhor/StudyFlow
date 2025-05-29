import React from 'react';
import { Project } from '../types';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button,
  Chip
} from '@mui/material';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getStatusColor = () => {
    switch (project.status) {
      case 'Em andamento':
        return 'primary';
      case 'Concluído':
        return 'success';
      case 'Rascunho':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {project.subject}
        </Typography>
        <Chip 
          label={project.status} 
          color={getStatusColor()} 
          size="small" 
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {project.summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Editar
        </Button>
        <Button size="small" color="primary">
          Visualizar
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;