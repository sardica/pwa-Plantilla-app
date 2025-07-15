// frontend-clients/app-web/src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IFormInputs } from './types';

function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();
  const { signin, isAuthenticated, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(data => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/cuadernos');
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            {loginErrors.map((error, i) => (
              <div className="bg-red-500/15 text-red-500 p-2 rounded-md text-center text-sm" key={i}>
                {error}
              </div>
            ))}
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-500 text-sm">El correo es requerido</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
              />
              {errors.password && <p className="text-red-500 text-sm">La contraseña es requerida</p>}
            </div>
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="underline">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;