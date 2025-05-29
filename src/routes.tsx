import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const NewProject = lazy(() => import('./pages/NewProject'));
const EditProject = lazy(() => import('./pages/EditProject'));
const EditProfile = lazy(() => import('./pages/EditProfile'));

export const routeElements = [
  {
    // Esta será a rota padrão para a URL raiz ('/')
    index: true,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Login /> {/* <-- A tela de Login é a inicial */}
      </Suspense>
    )
  },
  {
    path: 'home', // <-- Adicionamos um caminho explícito para a Home
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: 'register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Register />
      </Suspense>
    )
  },
  {
    path: 'new-project',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NewProject />
      </Suspense>
    )
  },
  {
    path: 'edit-project/:id',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <EditProject />
      </Suspense>
    )
  },
  {
    path: 'edit-profile',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <EditProfile />
      </Suspense>
    )
  }
];