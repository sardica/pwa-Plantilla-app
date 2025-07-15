// frontend-clients/app-web/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
        Bienvenido a Cuadernos App
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        La mejor app para gestionar tus notas y cuadernos. Organiza tus ideas, proyectos y pensamientos en un solo lugar.
      </p>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <Button asChild size="lg">
            <Link to="/cuadernos">Ir a mis Cuadernos</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg">
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Registrarse</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;