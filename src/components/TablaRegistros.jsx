import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function TablaRegistros({ isAdmin }) {
  const [registros, setRegistros] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados para Modal de Vista
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedRegistro, setSelectedRegistro] = useState(null)

  // Estados para Modal de Edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    id: null,
    nombre: '',
    cantidad_asiento: 1
  })

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

  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.type === 'number' ? (value ? parseInt(value) : '') : value
    })
  }

  const handleEditar = async (e) => {
    e.preventDefault()

    const cantidad = parseInt(editFormData.cantidad_asiento) || 0;
    if (!editFormData.nombre || cantidad <= 0) return

    setIsSubmitting(true)
    try {
      const valorCalculado = cantidad * 1.50

      const { error } = await supabase
        .from('registros')
        .update({
          nombre: editFormData.nombre,
          cantidad_asiento: cantidad,
          valor: valorCalculado
        })
        .eq('id', editFormData.id)

      if (error) throw error

      await fetchRegistros()
      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error al actualizar:", error)
      alert("Hubo un error al actualizar el registro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      try {
        const { error } = await supabase
          .from('registros')
          .update({ habilitado: false })
          .eq('id', id)

        if (error) throw error
        await fetchRegistros()
      } catch (error) {
        console.error("Error al eliminar:", error)
        alert("Hubo un error al intentar eliminar el registro.")
      }
    }
  }

  const currentTotal = ((parseInt(formData.cantidad_asiento) || 0) * 1.50).toFixed(2);
  const currentEditTotal = ((parseInt(editFormData.cantidad_asiento) || 0) * 1.50).toFixed(2);

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
            {!isAdmin && (
              <Link
                to="/login"
                className="bg-transparent text-white hover:bg-blue-700 font-bold py-2 px-3 sm:px-4 rounded-lg shadow-sm border border-blue-400 transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Acceder</span>
              </Link>
            )}
          </div>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-blue-500 font-medium">Cargando registros...</p>
            </div>
          ) : (
            <div className="w-full">
              {/* VISTA ESCRITORIO (TABLA) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Nombre</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Cant. Asientos</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Valor total</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-blue-800 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    {registros.map((registro, index) => (
                      <tr key={registro.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-blue-900/40">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-800">
                          {registro.nombre}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold text-blue-800 bg-blue-100 rounded border border-blue-200">
                            {registro.cantidad_asiento || 0}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-blue-700 font-bold">
                          ${Number(registro.valor).toFixed(2)}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => {
                                setSelectedRegistro(registro)
                                setIsViewModalOpen(true)
                              }}
                              className="text-blue-500 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-50 cursor-pointer" title="Ver detalle">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            {isAdmin && (
                              <>
                                <button 
                                  onClick={() => {
                                    setEditFormData({
                                      id: registro.id,
                                      nombre: registro.nombre,
                                      cantidad_asiento: registro.cantidad_asiento
                                    })
                                    setIsEditModalOpen(true)
                                  }}
                                  className="text-indigo-500 hover:text-indigo-800 transition-colors p-1 rounded-md hover:bg-indigo-50 cursor-pointer" title="Editar">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleEliminar(registro.id)}
                                  className="text-red-500 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-50 cursor-pointer" title="Eliminar">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {registros.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          <p className="mt-4 text-sm text-gray-500 font-medium">No hay registros disponibles</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* VISTA MÓVIL (CARDS) */}
              <div className="md:hidden flex flex-col gap-4 p-4 bg-gray-50/50">
                {registros.map((registro, index) => (
                  <div key={registro.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Registro #{index + 1}</span>
                        <h4 className="font-black text-gray-800 text-lg leading-tight">{registro.nombre}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-blue-600 block leading-none">${Number(registro.valor).toFixed(2)}</span>
                        <span className="text-xs font-bold text-gray-400 mt-1 block">Total</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">
                          {registro.cantidad_asiento} <span className="text-blue-500/80 font-semibold">asientos</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedRegistro(registro)
                            setIsViewModalOpen(true)
                          }}
                          className="text-blue-500 hover:text-blue-800 transition-colors p-2 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer" title="Ver detalle">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {isAdmin && (
                          <>
                            <button 
                              onClick={() => {
                                setEditFormData({
                                  id: registro.id,
                                  nombre: registro.nombre,
                                  cantidad_asiento: registro.cantidad_asiento
                                })
                                setIsEditModalOpen(true)
                              }}
                              className="text-indigo-500 hover:text-indigo-800 transition-colors p-2 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer" title="Editar">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleEliminar(registro.id)}
                              className="text-red-500 hover:text-red-800 transition-colors p-2 rounded-xl bg-red-50 border border-red-100 cursor-pointer" title="Eliminar">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {registros.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500 font-medium">No hay registros disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
      {/* MODAL DE EDITAR REGISTRO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Asientos
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/70 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditar} className="p-6 space-y-5">
              {/* CAMPO NOMBRE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre o Familia</label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={editFormData.nombre}
                  onChange={handleEditChange}
                  placeholder="Ej. Luis Orozco o Familia Orozco"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm block"
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
                    value={editFormData.cantidad_asiento}
                    onChange={handleEditChange}
                    placeholder="1"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white text-sm"
                  />
                </div>
              </div>

              {/* VALOR CALCULADO A MOSTRAR */}
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-800">Costo ($1.50 por c/u)</p>
                  <p className="text-xs text-indigo-600 mt-1">Se calculará automáticamente</p>
                </div>
                <div className="text-2xl font-black text-indigo-700">
                  ${currentEditTotal}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
