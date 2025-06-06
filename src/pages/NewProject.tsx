// src/pages/NewProject.tsx

import React, { useState, useEffect } from 'react'; // <-- Importar useEffect
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
  IconButton, // <-- Importar IconButton
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Project, User } from '../types/types'; // <-- Importar Project e User do types.ts

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState({
    subject: '',
    status: 'Rascunho',
    summary: '',
  });

  // Estado para múltiplos arquivos anexados
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  // Estado para controlar o erro de nome duplicado
  const [subjectError, setSubjectError] = useState(false);
  const [subjectHelperText, setSubjectHelperText] = useState('');

  // --- NOVO: Estado para armazenar o usuário logado ---
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // --- NOVO: useEffect para carregar o usuário logado ---
  useEffect(() => {
    const storedLoggedInUser = localStorage.getItem('loggedInUser');
    if (storedLoggedInUser) {
      try {
        const user: User = JSON.parse(storedLoggedInUser);
        setLoggedInUser(user);
      } catch (e) {
        console.error("Erro ao parsear loggedInUser no NewProject:", e);
        navigate('/'); // <-- Redireciona para / (consistente com o App.tsx)
      }
    } else {
      navigate('/'); // <-- Redireciona para o login se não houver usuário logado
    }
  }, [navigate]); // navigate como dependência para evitar avisos do linter

  // --- Funções de Handler ---
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

  // Manipulador para múltiplos arquivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Converte o FileList (retornado pelo navegador) para um array de File
      setAttachedFiles(Array.from(e.target.files));
    } else {
      setAttachedFiles([]); // Limpa o array se nada for selecionado
    }
  };

  // Função para remover um arquivo específico da lista
  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- NOVO: Verificar se o usuário está logado antes de prosseguir ---
    if (!loggedInUser) {
        alert("Você precisa estar logado para criar um projeto.");
        navigate('/'); // <-- Redireciona para /
        return;
    }

    const stored = localStorage.getItem('projects');
    const allProjects: Project[] = stored ? JSON.parse(stored) : []; // Tipado como Project[]

    // --- NOVO: Validação de nome duplicado APENAS entre os projetos DESTE USUÁRIO ---
    const currentUserProjects = allProjects.filter((p: Project) => p.authorId === loggedInUser.id);
    const isDuplicate = currentUserProjects.some(
      (project: Project) =>
        project.subject.toLowerCase().trim() === projectData.subject.toLowerCase().trim()
    );

    if (isDuplicate) {
      setSubjectError(true);
      setSubjectHelperText('Você já tem um projeto com este nome.');
      return; // Impede a criação do projeto
    }

    // --- NOVO: Cria o novo objeto de projeto com 'authorId' e 'author' do usuário logado ---
    const newProject: Project = { // Tipado como Project
      ...projectData,
      id: Date.now().toString(), // ID simples baseado no timestamp
      authorId: loggedInUser.id, // <-- CRUCIAL: Associa o projeto ao ID do usuário logado
      author: `${loggedInUser.firstName} ${loggedInUser.lastName}`, // Nome completo do autor
      updatedAt: 'Agora mesmo',
      avatarColor: '#2196f3', // Pode ser dinâmico no futuro
      attachedFileNames: attachedFiles.map(file => file.name),
      // Lembre-se: Em uma aplicação real, você faria o upload do 'attachedFiles' para um servidor aqui!
    };

    const updatedProjects = [...allProjects, newProject]; // Adiciona ao array de TODOS os projetos
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    console.log('Novo projeto salvo:', newProject);
    if (attachedFiles.length > 0) {
      console.log('Arquivos anexados (nomes):', attachedFiles.map(file => file.name));
    }

    navigate('/home'); // Redireciona para a página home após salvar
  };

  // --- NOVO: Exibir um estado de carregamento se o usuário logado ainda não foi carregado ---
  if (!loggedInUser) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Carregando dados do usuário...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Novo Projeto
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth margin="normal" label="Matéria" name="subject"
          value={projectData.subject} onChange={handleInputChange} required
          error={subjectError} helperText={subjectHelperText}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status" value={projectData.status} onChange={handleSelectChange}
            label="Status" required
          >
            <MenuItem value="Rascunho">Rascunho</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth margin="normal" label="Resumo" name="summary"
          multiline rows={4} value={projectData.summary} onChange={handleInputChange}
        />

        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept="image/*,.pdf,.doc,.docx" // Tipos de arquivo aceitos
            style={{ display: 'none' }} // Oculta o input original
            id="raised-button-file"
            multiple // Permite múltiplos arquivos
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="raised-button-file">
            <Button
              variant="outlined"
              component="span"
              startIcon={<AttachFileIcon />}
            >
              Anexar Arquivos
            </Button>
          </label>
          {/* Exibir múltiplos arquivos selecionados e opção de remover */}
          {attachedFiles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>
                Arquivos selecionados:
              </Typography>
              {attachedFiles.map((file, index) => (
                <Box key={file.name + index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ ml: 1, display: 'inline-block' }}>
                    {file.name}
                  </Typography>
                  <IconButton // <-- IconButton sendo usado
                    size="small"
                    color="error"
                    onClick={() => handleRemoveFile(file.name)}
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    <Box component="span" sx={{ fontSize: '0.8rem' }}>✖</Box>
                  </IconButton>
                </Box>
              ))}
            </Box>
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