// frontend-clients/app-web/src/components/Navbar.tsx

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
// CORRECCIÓN: Se importan los iconos necesarios
import { Home, BookCopy, User, LogIn, LogOut, PlusCircle } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, signout, user } = useAuth();

  return (
    <nav className='bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg'>
      <Link to={isAuthenticated ? '/cuadernos' : '/'}>
        <h1 className='text-2xl font-bold'>Didaktos</h1>
      </Link>
      <ul className='flex items-center gap-x-4'>
        {isAuthenticated ? (
          <>
            <li className='hidden sm:block'>
              Bienvenido, {user?.name}!
            </li>
            <li>
              <Link to='/add-cuaderno' className='flex items-center gap-x-1 bg-indigo-500 px-4 py-2 rounded-md'>
                <PlusCircle size={20} /> {/* Icono de Añadir */}
                <span className='hidden sm:inline'>Nuevo Cuaderno</span>
              </Link>
            </li>
            <li>
              <Link to='/' onClick={() => signout()} className='flex items-center gap-x-1'>
                <LogOut size={20} /> {/* Icono de Salir */}
                <span className='hidden sm:inline'>Salir</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login' className='flex items-center gap-x-1'>
                <LogIn size={20} /> {/* Icono de Iniciar Sesión */}
                Login
              </Link>
            </li>
            <li>
              <Link to='/register' className='flex items-center gap-x-1'>
                <User size={20} /> {/* Icono de Registrarse */}
                Register
              </Link>
            </li>
          </>
        )}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
