export default function TablaRegistros({ registros, loading, isAdmin, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-500 font-medium">Cargando registros...</p>
      </div>
    )
  }

  return (
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
                      onClick={() => onView(registro)}
                      className="text-blue-500 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-50 cursor-pointer" title="Ver detalle">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    {isAdmin && (
                      <>
                        <button 
                          onClick={() => onEdit(registro)}
                          className="text-indigo-500 hover:text-indigo-800 transition-colors p-1 rounded-md hover:bg-indigo-50 cursor-pointer" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => onDelete(registro.id)}
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
                  onClick={() => onView(registro)}
                  className="text-blue-500 hover:text-blue-800 transition-colors p-2 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer" title="Ver detalle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                {isAdmin && (
                  <>
                    <button 
                      onClick={() => onEdit(registro)}
                      className="text-indigo-500 hover:text-indigo-800 transition-colors p-2 rounded-xl bg-indigo-50 border border-indigo-100 cursor-pointer" title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onDelete(registro.id)}
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
  )
}
