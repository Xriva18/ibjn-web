import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errorLogin, setErrorLogin] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorLogin('')

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('usuario', usuario)
        .eq('contrasena', contrasena)
        .maybeSingle() // maybeSingle no da error feo si no hay coincidencias, retorna null

      if (error) {
        throw new Error('Error de conexión')
      }

      if (!data) {
        throw new Error('Credenciales inválidas')
      }

      // Si hace match correcto:
      localStorage.setItem('isAdminLoggedIn', 'true')
      navigate('/admin')

    } catch (error) {
      console.error(error)
      setErrorLogin('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all hover:scale-[1.01]">
        <div className="bg-blue-600 px-6 py-10 text-center relative overflow-hidden">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500 opacity-50 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-blue-700 opacity-50 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Acceso Privado</h2>
            <p className="text-blue-100 mt-2 font-medium">Panel de administración</p>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {errorLogin && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-200 flex items-center gap-2 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errorLogin}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Usuario</label>
            <input
              type="text"
              required
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-gray-800 shadow-sm"
              placeholder="admin"
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-gray-800 shadow-sm"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verificando...</span>
              </div>
            ) : (
              'Entrar al panel'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
