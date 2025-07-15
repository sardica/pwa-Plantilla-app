// frontend-clients/app-web/src/pages/CuadernoFormPage.tsx
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface IFormInputs {
  title: string;
  content: string;
}

function CuadernoFormPage() {
  const { register, handleSubmit, setValue } = useForm<IFormInputs>();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    async function loadCuaderno() {
      if (params.id) {
        const res = await axios.get(`/cuadernos/${params.id}`);
        setValue('title', res.data.title);
        setValue('content', res.data.content);
      }
    }
    loadCuaderno();
  }, [params.id, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (params.id) {
        await axios.put(`/cuadernos/${params.id}`, data);
      } else {
        await axios.post('/cuadernos', data);
      }
      navigate('/cuadernos');
    } catch (error) {
      console.error("Error guardando el cuaderno:", error);
    }
  });

  return (
    <div className="flex h-[calc(100vh-200px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{params.id ? "Editar Cuaderno" : "Nuevo Cuaderno"}</CardTitle>
          <CardDescription>
            {params.id ? "Modifica los detalles de tu cuaderno." : "Crea una nueva nota para organizar tus ideas."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
                placeholder="El título de tu nota"
                {...register("title", { required: true })}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                rows={5}
                placeholder="Escribe aquí el contenido..."
                {...register("content", { required: true })}
              />
            </div>
            <Button type="submit">Guardar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CuadernoFormPage;