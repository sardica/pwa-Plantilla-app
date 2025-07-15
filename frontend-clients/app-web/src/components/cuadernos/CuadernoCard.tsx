import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Cuaderno {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface CuadernoCardProps {
  cuaderno: Cuaderno;
}

export function CuadernoCard({ cuaderno }: CuadernoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cuaderno.title}</CardTitle>
        <CardDescription>
          Creado: {new Date(cuaderno.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{cuaderno.content}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to={`/cuadernos/${cuaderno.id}`}>Editar</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
