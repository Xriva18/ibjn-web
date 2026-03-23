import { useLocation, Navigate } from 'react-router-dom'
import TablaRegistros from './components/TablaRegistros'

function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')

  // Proteger la ruta de administrador
  if (isAdminPath) {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />
    }
  }

  return <TablaRegistros isAdmin={isAdminPath} />
}

export default App
