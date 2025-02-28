import React from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {

  const router = useRouter();

  return (
    <nav className="bg-gray-800">
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
                  <div className="absolute hidden group-hover:block w-48 rounded-md shadow-lg bg-white z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-button">
                      <a href="#" onClick={() => router.push('/dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Resumen de partidas</a>
                      <a href="#" onClick={() => router.push('/totaldata')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Estadísticas</a>
                      <a href="#" onClick={() => router.push('/matchList')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Lista de partidas</a>
                      <a href="#" onClick={() => router.push('/weapons')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Lista de armas</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Títulos</a>
                      {/* Añade aquí las subopciones de Estadísticas */}
                    </div>
                  </div>
                </div>

                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Gameplays</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Música</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Nemes</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Kazames</a>
                <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Varios</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}