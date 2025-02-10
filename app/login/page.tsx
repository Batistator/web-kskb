"use client"
import React, { useState } from 'react';
import Image from 'next/legacy/image'
import { useRouter } from 'next/navigation';
import { fakeLogin } from './authService'; // Importa la función simulada

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const router = useRouter(); // Hook para la navegación en Next.js 13 App Router

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Evita la recarga de la página al enviar el formulario
    setError(null); // Limpia errores previos al intentar un nuevo login

    const result = await fakeLogin(username, password); // Llama a la función de login simulada

    if (result.token) {
      // Login exitoso: guarda el token (por ahora en localStorage, ¡considera opciones más seguras para producción!)
      localStorage.setItem('awj_token', result.token);
      // Redirige a la página de placeholder (por ejemplo, '/dashboard')
      router.push('/dashboard'); // ¡Aún no hemos creado la página '/dashboard'! La crearemos en el siguiente paso.
    } else if (result.error) {
      // Login fallido: muestra el error
      setError(result.error);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Imagen a la izquierda */}
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/background-login.png')` }}>
        {/* Puedes poner un texto o logo superpuesto si quieres */}
        <div className="flex flex-col justify-center px-12 bg-opacity-50 bg-black">
          <h2 className="text-2xl font-bold text-white">Kasukabe Squad</h2>
          <p className="mt-2 text-gray-100">Nos gusta ir a dormir calentitos.</p>
        </div>
      </div>

      {/* Formulario de Login a la derecha */}
      <div className="flex w-full lg:w-1/2 justify-center items-center px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div>
            <Image priority src="/logo-kskb.png" alt="Picture of the author" width={500} height={200}/> 
          </div>

          <div className="mt-7">
            <form className="space-y-6" onSubmit={handleSubmit}> {/* Añade onSubmit={handleSubmit} al formulario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Nombre de usuario
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tu nombre de usuario"
                    value={username} // Vincula el valor del input al estado username
                    onChange={(e) => setUsername(e.target.value)} // Actualiza el estado username al cambiar el input
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 text-gray-700 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tu contraseña"
                    value={password} // Vincula el valor del input al estado password
                    onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password al cambiar el input
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Checkbox "Recuérdame" (opcional) */}
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Recuérdame
                  </label>
                </div>

                <div className="text-sm">
                  {/* Link "¿Olvidaste tu contraseña?" (opcional) */}
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
            {error && ( // Muestra el mensaje de error si existe
              <div className="mt-4 text-red-500 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}