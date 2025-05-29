import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';

interface Project {
  id: string;
  subject: string; // Nome do projeto
  status: string;
  summary: string;
  author: string;
  updatedAt: string;
  avatarColor: string;
  attachedFileName?: string;
}

export const EditProject: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<Project>({
    id: '',
    subject: '',
    status: 'Rascunho',
    summary: '',
    author: '',
    updatedAt: '',
    avatarColor: '',
    attachedFileName: undefined
  });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Carrega os dados do projeto ao montar o componente
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects: Project[] = JSON.parse(storedProjects);
      const projectToEdit = projects.find(project => project.id === id);
      if (projectToEdit) {
        setProjectData(projectToEdit);
        if (projectToEdit.attachedFileName) {
          setAttachedFile(new File([], projectToEdit.attachedFileName));
        } else {
          setAttachedFile(null);
        }
      } else {
        navigate('/home');
      }
    } else {
      navigate('/home');
    }
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name as string]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
      setProjectData(prev => ({ ...prev, attachedFileName: e.target.files![0].name }));
    } else {
      setAttachedFile(null);
      setProjectData(prev => ({ ...prev, attachedFileName: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects: Project[] = JSON.parse(storedProjects);

      // Validação: Checar se o nome do projeto já existe em OUTROS projetos
      const isDuplicate = projects.some(
        project =>
          project.id !== id && // Ignora o próprio projeto que está sendo editado
          project.subject.toLowerCase() === projectData.subject.toLowerCase().trim() // Compara ignorando case e espaços
      );

      if (isDuplicate) {
        alert('Já existe um projeto com este nome. Por favor, escolha outro nome.');
        return; // Impede o salvamento
      }

      const updatedProjects = projects.map(project =>
        project.id === id
          ? {
              ...projectData,
              updatedAt: new Date().toLocaleString(),
              attachedFileName: attachedFile ? attachedFile.name : undefined
            }
          : project
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }

    navigate('/home');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Projeto {projectData.subject || 'Carregando...'} {/* <-- AQUI ESTÁ A MUDANÇA */}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Matéria"
          name="subject"
          value={projectData.subject}
          onChange={handleInputChange}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={projectData.status}
            label="Status"
            onChange={handleSelectChange}
            required
          >
            <MenuItem value="Rascunho">Rascunho</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Resumo"
          name="summary"
          multiline
          rows={4}
          value={projectData.summary}
          onChange={handleInputChange}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="raised-button-file-edit"
            multiple={false}
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file-edit">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Anexar Novo Arquivo
            </Button>
          </label>
          {attachedFile && (
            <Typography variant="body2" sx={{ mt: 1, ml: 1, display: 'inline-block' }}>
              Arquivo selecionado: **{attachedFile.name}**
            </Typography>
          )}
          {projectData.attachedFileName && !attachedFile && (
            <Button
              variant="text"
              color="error"
              size="small"
              sx={{ ml: 2, mt: 1 }}
              onClick={() => {
                setAttachedFile(null);
                setProjectData(prev => ({ ...prev, attachedFileName: undefined }));
              }}
            >
              Remover Anexo
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
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
      </Box>
    </Container>
  );
};

export default EditProject;