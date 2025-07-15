import { Routes, Route } from 'react-router-dom'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CuadernosPage from './pages/CuadernosPage'
import CuadernoFormPage from './pages/CuadernoFormPage'
import ProfilePage from './pages/ProfilePage'
import HomePage from './pages/HomePage'

import ProtectedRoute from './ProtectedRoute'
import { Navbar } from './components/Navbar'

function App () {
  return (
     <main className="container mx-auto px-10 bg-background text-foreground"> 
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/cuadernos' element={<CuadernosPage />} />
          <Route path='/add-cuaderno' element={<CuadernoFormPage />} />
          <Route path='/cuadernos/:id' element={<CuadernoFormPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App