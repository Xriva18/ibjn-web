import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from './supabaseClient'
import TablaRegistros from './components/TablaRegistros'

export default function Publico() {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados para Modal de Vista
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState(null)

  // Estados para el Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad_asiento: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchRegistros()
  }, [])

  async function fetchRegistros() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('registros')
        .select('*')
        .eq('habilitado', true)
        .order('id', { ascending: true })

      if (error) throw error
      if (data) setRegistros(data)
    } catch (error) {
      console.error("Error fetching data: ", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? (value ? parseInt(value) : '') : value
    })
  }

  const handleRegistrar = async (e) => {
    e.preventDefault()

    const cantidad = parseInt(formData.cantidad_asiento) || 0;
    if (!formData.nombre || cantidad <= 0) return

    setIsSubmitting(true)
    try {
      const valorCalculado = cantidad * 1.50

      const { data, error } = await supabase
        .from('registros')
        .insert([
          {
            nombre: formData.nombre,
            cantidad_asiento: cantidad,
            valor: valorCalculado
          }
        ])
        .select()

      if (error) throw error

      await fetchRegistros()
      setIsModalOpen(false)
      setFormData({ nombre: '', cantidad_asiento: 1 })
    } catch (error) {
      console.error("Error al insertar:", error)
      alert("Hubo un error al guardar el registro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentTotal = ((parseInt(formData.cantidad_asiento) || 0) * 1.50).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 p-8 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-200">
        <div className="bg-blue-600 px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 text-center sm:text-left">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Tabla de Registros
          </h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
            <span className="hidden sm:inline-flex bg-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {registros.length} Items
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-md transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Registrar</span>
            </button>
            <Link
              to="/login"
              className="bg-transparent text-white hover:bg-blue-700 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm border border-blue-400 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Acceder</span>
            </Link>
          </div>
        </div>

        <div className="p-0">
          <TablaRegistros 
            registros={registros} 
            loading={loading} 
            isAdmin={false} 
            onView={(registro) => {
              setSelectedRegistro(registro)
              setIsViewModalOpen(true)
            }}
          />
        </div>
      </div>

      {/* MODAL DE REGISTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Registrar Asientos
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRegistrar} className="p-6 space-y-5">
              {/* CAMPO NOMBRE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre o Familia</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Luis Orozco o Familia Orozco"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all text-sm block"
                />
              </div>

              {/* CAMPO CANTIDAD ASIENTOS */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cantidad de Asientos</label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-bold">
                    #
                  </span>
                  <input
                    type="number"
                    name="cantidad_asiento"
                    min="1"
                    required
                    value={formData.cantidad_asiento}
                    onChange={handleChange}
                    placeholder="1"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
              </div>

              {/* VALOR CALCULADO A MOSTRAR */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-800">Costo ($1.50 por c/u)</p>
                  <p className="text-xs text-blue-600 mt-1">Se calculará automáticamente</p>
                </div>
                <div className="text-2xl font-black text-blue-700">
                  ${currentTotal}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Registrar'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VER DETALLE */}
      {isViewModalOpen && selectedRegistro && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                </svg>
                Detalles del Registro
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-blue-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre o Familia</p>
                <p className="text-lg font-bold text-gray-800 break-words">{selectedRegistro.nombre}</p>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Asientos</p>
                  <p className="text-3xl font-black text-blue-800">{selectedRegistro.cantidad_asiento}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex-1 flex flex-col items-center justify-center text-center">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-2xl font-black text-green-800 mt-1">${Number(selectedRegistro.valor).toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
