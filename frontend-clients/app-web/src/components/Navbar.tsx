import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Importación corregida
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { isAuthenticated, signout, user } = useAuth();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <div className="container h-14 flex items-center">
        <div className="mr-4 md:flex">
          <Link to={isAuthenticated ? '/cuadernos' : '/'} className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">Cuadernos App</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ul className="flex items-center gap-x-4">
            {isAuthenticated ? (
              <>
                <li className="text-sm text-muted-foreground">
                  Bienvenido, {user?.name}
                </li>
                <li>
                  <Button asChild>
                    <Link to='/add-cuaderno'>Añadir Cuaderno</Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={() => signout()}>
                    Cerrar Sesión
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button asChild>
                    <Link to='/login'>Login</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild variant="ghost">
                    <Link to='/register'>Register</Link>
                  </Button>
                </li>
              </>
            )}
          </ul>
          <div className="ml-4">
             <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
