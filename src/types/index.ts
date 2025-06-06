export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
  
  export interface Project {
    id: string;
    subject: string;
    status: 'Em andamento' | 'Concluído' | 'Rascunho';
    summary: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
  }
  
  export interface AuthFormData {
    email: string;
    password: string;
  }
  
  export interface RegisterFormData extends AuthFormData {
    firstName: string;
    lastName: string;
    phone: string;
    confirmPassword: string;
  }