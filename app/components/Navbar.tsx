import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext'; // Importar el ThemeContext

export default function Navbar() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme(); // Usar el contexto del tema
  const [isInitialized, setIsInitialized] = useState(false); // Estado para controlar la inicialización

  useEffect(() => {
    // Esperar a que el estado de isDarkMode se sincronice con localStorage
    setIsInitialized(true);
  }, []);

  // No renderizar el botón hasta que el estado esté inicializado
  if (!isInitialized) {
    return null; // O un placeholder vacío si es necesario
  }

  return (
    <nav className={`${isDarkMode ? "bg-gray-900" : "bg-gray-800"}`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <span className="font-bold text-white text-xl">Kasukabe Squad</span> {/* Título del Dashboard */}
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Opciones del Navbar */}
                <div className="relative group"> {/* Estadísticas con Dropdown */}
                  <button
                    type="button"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    aria-expanded="false"
                  >
                    Estadísticas
                    <svg className="ml-1 h-5 w-5 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {/* Dropdown oculto por defecto */}
                  
                  <div className={`absolute hidden group-hover:block w-48 rounded-md shadow-lg z-10 ${isDarkMode ? "bg-gray-700" : "bg-white"}`}>
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                      <a href="#" onClick={() => router.push('/dashboard')} className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} role="menuitem">Resumen de partidas</a>
                      <a href="#" onClick={() => router.push('/totaldata')} className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} role="menuitem">Estadísticas</a>
                      <a href="#" onClick={() => router.push('/matchList')} className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} role="menuitem">Lista de partidas</a>
                      <a href="#" onClick={() => router.push('/weapons')} className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} role="menuitem">Lista de armas</a>
                      <a href="#" onClick={() => router.push('/titles')} className={`block px-4 py-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`} role="menuitem">Títulos</a>
                    </div>
                  </div>
                </div>

                <a href="#" onClick={() => router.push('/gameplays')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gameplays</a>
                <a href="#" onClick={() => router.push('/music')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Música</a>
                <a href="#" onClick={() => router.push('/nemes')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Nemes</a>
                <a href="#" onClick={() => router.push('/kazames')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Kazames</a>
                <a href="#" onClick={() => router.push('/misc')} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Varios</a>
              </div>
            </div>
          </div>
          {/* Botón deslizante para alternar el tema */}
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
                className="sr-only peer"
                tabIndex={-1}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 flex items-center justify-between px-1">
                <span className="text-xs text-gray-500 dark:text-gray-300 pointer-events-none">🌙</span>
                <span className="text-xs text-gray-500 dark:text-gray-300 pointer-events-none">🌞</span>
              </div>
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></span>
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}