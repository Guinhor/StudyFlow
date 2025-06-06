// src/pages/EditProject.tsx

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
  SelectChangeEvent,
  IconButton, // <-- Importar IconButton para o botão de anexo
} from '@mui/material';

import AttachFileIcon from '@mui/icons-material/AttachFile';

import { Project, User } from '../types/types'; // <-- CRUCIAL: Importar Project e User do types.ts

export const EditProject: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado para os dados do projeto
  const [projectData, setProjectData] = useState<Project>({
    id: '',
    subject: '',
    status: 'Rascunho',
    summary: '',
    authorId: '', // <-- NOVO: Inicializa o authorId
    author: '',
    updatedAt: '',
    avatarColor: '',
    attachedFileNames: [], // <-- NOVO: Inicializa como array vazio
  });

  // Estado para o arquivo anexado (objeto File, usado para o preview de um novo anexo)
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

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
        console.error("Erro ao parsear loggedInUser no EditProject:", e);
        navigate('/'); // Redireciona se os dados estiverem corrompidos
      }
    } else {
      navigate('/'); // Redireciona para o login se não houver usuário logado
    }
  }, [navigate]); // navigate como dependência

  // --- Carrega os dados do projeto (e filtra por usuário logado) ---
  useEffect(() => {
    if (!loggedInUser) return; // Espera o loggedInUser ser carregado antes de buscar o projeto

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const allProjects: Project[] = JSON.parse(storedProjects);
      // Filtrar projetos por ID do usuário logado E o ID do projeto da URL
      const projectToEdit = allProjects.find(
        p => p.id === id && p.authorId === loggedInUser.id // <-- Filtro por ID do usuário e ID do projeto
      );

      if (projectToEdit) {
        setProjectData(projectToEdit);
        // Lida com attachedFileNames, que agora é um array
        if (projectToEdit.attachedFileNames && projectToEdit.attachedFileNames.length > 0) {
          // Para exibição, usamos o nome do primeiro arquivo existente para o preview.
          // Note: Isso não recria o objeto File real, apenas seu nome.
          setAttachedFile(new File([], projectToEdit.attachedFileNames[0]));
        } else {
          setAttachedFile(null);
        }
      } else {
        // Se o projeto não for encontrado OU não pertencer ao usuário logado
        alert("Projeto não encontrado ou você não tem permissão para editá-lo.");
        navigate('/home'); // Redirecionar
      }
    } else {
      navigate('/home'); // Redirecionar se não houver projetos salvos
    }
  }, [id, navigate, loggedInUser]); // loggedInUser como dependência


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name as string]: value }));
  };

  // --- NOVO: handleFileChange para attachedFileNames (array) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setAttachedFile(selectedFile); // Define o arquivo File real (para o preview)
      // Atualiza projectData com o nome do novo arquivo em um array
      setProjectData(prev => ({ ...prev, attachedFileNames: [selectedFile.name] }));
    } else {
      setAttachedFile(null);
      setProjectData(prev => ({ ...prev, attachedFileNames: [] })); // Limpa os nomes se nada for selecionado
    }
  };
  // --- Fim do handleFileChange ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- NOVO: Verificar se o usuário está logado antes de salvar ---
    if (!loggedInUser) {
        alert("Você precisa estar logado para salvar as alterações.");
        navigate('/');
        return;
    }

    const storedProjects = localStorage.getItem('projects');
    const allProjects: Project[] = storedProjects ? JSON.parse(storedProjects) : []; // Todos os projetos

    // Validação: Checar se o nome do projeto já existe em OUTROS projetos DO MESMO USUÁRIO
    const isDuplicate = allProjects.some(
      project =>
        project.id !== id && // Ignora o próprio projeto sendo editado
        project.authorId === loggedInUser.id && // <-- Verifica APENAS projetos do usuário logado
        project.subject.toLowerCase().trim() === projectData.subject.toLowerCase().trim()
    );

    if (isDuplicate) {
      alert('Você já tem outro projeto com este nome. Por favor, escolha outro nome.');
      return;
    }

    // --- Atualizar o projeto no array de TODOS os projetos ---
    const updatedProjects = allProjects.map(project =>
      // Condição de atualização: o ID do projeto bate E o authorId do projeto bate com o usuário logado
      project.id === id && project.authorId === loggedInUser.id
        ? {
            ...projectData, // Usa os dados do estado (já atualizados pelo input)
            updatedAt: new Date().toLocaleString(),
            attachedFileNames: projectData.attachedFileNames || [], // Garante que é um array, usa o que está no estado
            authorId: loggedInUser.id, // Garante que o authorId permaneça o do usuário logado
            author: `${loggedInUser.firstName} ${loggedInUser.lastName}`, // Garante que o nome do autor esteja atualizado
          }
        : project // Mantém o projeto inalterado se não for o que estamos editando ou não pertencer ao usuário
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    navigate('/home');
  };

  // --- NOVO: Exibir estado de carregamento se o usuário ou projeto não carregou ---
  if (!loggedInUser || (id && !projectData.id)) { // Se é edição e projectData ainda não carregou
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Carregando projeto...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Projeto: **{projectData.subject || 'Carregando...'}**
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

        {/* --- Campo de Anexar Arquivo --- */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="raised-button-file-edit"
            multiple={false} // Para edição, geralmente se permite 1 arquivo por vez
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
          {/* Exibir o nome do arquivo atualmente anexado ou do novo selecionado */}
          {attachedFile && (
            <Typography variant="body2" sx={{ mt: 1, ml: 1, display: 'inline-block' }}>
              Arquivo selecionado: **{attachedFile.name}**
            </Typography>
          )}
          {/* Botão para remover anexo existente (aparece se houver nome de arquivo e nenhum novo foi selecionado) */}
          {projectData.attachedFileNames && projectData.attachedFileNames.length > 0 && !attachedFile && (
            <Button
              variant="text"
              color="error"
              size="small"
              sx={{ ml: 2, mt: 1 }}
              onClick={() => {
                setAttachedFile(null); // Limpa o File do preview
                setProjectData(prev => ({ ...prev, attachedFileNames: [] })); // Limpa o nome do arquivo no estado do projeto
              }}
            >
              Remover Anexo
            </Button>
          )}
        </Box>
        {/* --- Fim do Campo de Anexar Arquivo --- */}

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