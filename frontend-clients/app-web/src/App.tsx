// frontend-clients/app-web/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import CuadernosPage from './pages/CuadernosPage';
import CuadernoFormPage from './pages/CuadernoFormPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import ProtectedRoute from './ProtectedRoute';
import { Navbar } from './components/Navbar';

function App() {
  return (
    // Se devuelve el BrowserRouter a este archivo para asegurar el contexto del enrutador.
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <main className='container mx-auto px-10'>
            <Navbar />
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/verify-email' element={<VerifyEmailPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/cuadernos' element={<CuadernosPage />} />
                <Route path='/add-cuaderno' element={<CuadernoFormPage />} />
                <Route path='/cuadernos/:id' element={<CuadernoFormPage />} />
              </Route>
            </Routes>
          </main>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
