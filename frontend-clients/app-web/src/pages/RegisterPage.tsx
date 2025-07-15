// frontend-clients/app-web/src/pages/RegisterPage.tsx
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth'; // La importación ahora es desde un .ts
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // La importación ahora es desde un .tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // La importación ahora es desde un .tsx
import { Input } from "@/components/ui/input"; // La importación ahora es desde un .tsx
import { Label } from "@/components/ui/label"; // La importación ahora es desde un .tsx
import { IFormInputs } from './types';

function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/cuadernos');
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    // Aseguramos que los datos enviados coincidan con lo que espera el backend
    const dataToSubmit = {
      name: values.username,
      email: values.email,
      password: values.password,
    };
    signup(dataToSubmit);
  });

  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Ingresa tus datos para crear una nueva cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            {registerErrors.map((error, i) => (
              <div className="bg-red-500/15 text-red-500 p-2 rounded-md text-center text-sm" key={i}>
                {error}
              </div>
            ))}
            <div className="grid gap-2">
              <Label htmlFor="username">Nombre</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tu Nombre"
                {...register("username", { required: "El nombre es requerido" })}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email", { required: "El correo es requerido" })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: "La contraseña es requerida" })}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="underline">
              Inicia Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
