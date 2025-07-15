// frontend-clients/app-web/src/pages/CuadernosPage.tsx
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { CuadernoCard } from '../components/cuadernos/CuadernoCard';

interface Cuaderno {
  id: number;
  title: string;
  content: string;
  // Consider adding other relevant fields like createdAt, updatedAt if they exist
}

function CuadernosPage() {
  const [cuadernos, setCuadernos] = useState<Cuaderno[]>([]);

  useEffect(() => {
    async function loadCuadernos() {
      try {
        const res = await axios.get<Cuaderno[]>('/cuadernos');
        setCuadernos(res.data);
      } catch (error) {
        console.error("Error cargando los cuadernos:", error);
      }
    }
    loadCuadernos();
  }, []);

  if (cuadernos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-bold">No hay cuadernos aún</h1>
        <p className="text-muted-foreground">¡Crea tu primer cuaderno para empezar!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
      {cuadernos.map(cuaderno => (
        <CuadernoCard cuaderno={cuaderno} key={cuaderno.id} />
      ))}
    </div>
  );
}

export default CuadernosPage;