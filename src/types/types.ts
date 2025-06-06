// src/types/types.ts

// Garanta que 'export' esteja aqui
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface Project {
  id: string;
  subject: string;
  status: string;
  summary: string;
  authorId: string;
  author: string;
  updatedAt: string;
  avatarColor: string;
  attachedFileNames?: string[];
}