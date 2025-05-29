import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  SelectChangeEvent,
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    subject: '',
    status: 'Rascunho',
    summary: '',
  });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  // Estado para controlar o erro de nome duplicado
  const [subjectError, setSubjectError] = useState(false);
  const [subjectHelperText, setSubjectHelperText] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({ ...prev, [name]: value }));

    // Limpa o erro de nome duplicado ao digitar
    if (name === 'subject') {
      setSubjectError(false);
      setSubjectHelperText('');
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setProjectData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    } else {
      setAttachedFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const stored = localStorage.getItem('projects');
    const projects = stored ? JSON.parse(stored) : [];

    // --- Validação de nome duplicado ---
    const isDuplicate = projects.some(
      (project: { subject: string; }) =>
        project.subject.toLowerCase().trim() === projectData.subject.toLowerCase().trim()
    );

    if (isDuplicate) {
      setSubjectError(true);
      setSubjectHelperText('Já existe um projeto com este nome. Por favor, escolha outro.');
      return; // Impede a criação do projeto
    }
    // --- Fim da validação de nome duplicado ---

    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      author: 'Usuário Atual',
      updatedAt: 'Agora mesmo',
      avatarColor: '#2196f3',
      attachedFileName: attachedFile ? attachedFile.name : undefined,
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    console.log('Novo projeto salvo:', newProject);
    if (attachedFile) {
      console.log('Arquivo anexado:', attachedFile);
    }

    navigate('/home');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Novo Projeto
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Matéria"
          name="subject"
          value={projectData.subject}
          onChange={handleInputChange}
          required
          // Propriedades de erro para nome duplicado
          error={subjectError}
          helperText={subjectHelperText}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={projectData.status}
            onChange={handleSelectChange}
            label="Status"
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
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Anexar Arquivo
            </Button>
          </label>
          {attachedFile && (
            <Typography variant="body2" sx={{ mt: 1, ml: 1, display: 'inline-block' }}>
              Arquivo selecionado: {attachedFile.name}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button variant="outlined" onClick={() => navigate('/home')}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Salvar Projeto
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NewProject;