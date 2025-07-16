// frontend-clients/app-web/src/pages/VerifyEmailPage.tsx

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No se encontró el token de verificación.');
      return;
    }

    const verifyAccount = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ocurrió un error al verificar tu cuenta.');
        setMessage('');
      }
    };

    verifyAccount();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md text-white text-center">
        {message && <p className="text-2xl">{message}</p>}
        {error && <p className="text-2xl text-red-500">{error}</p>}
        
        {/* Muestra un enlace para ir a iniciar sesión si la verificación fue exitosa o si ya estaba verificado */}
        {(message.includes('successfully') || message.includes('already verified')) && (
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 inline-block">
            Ir a Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
