'use client';

import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const backendLoginEndpoint = 'http://localhost:8080/api/auth/login';

    try {
      const response = await fetch(backendLoginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Importante: incluye las cookies en la petición
      });

      if (response.ok) {
        try {
          const data = await response.json();
          
          // Guardar el token en localStorage o en una cookie no-HttpOnly para acceso JavaScript
          if (data.token) {
            // Opción 1: Usar localStorage (simple pero menos seguro contra XSS)
            localStorage.setItem('jwt_token', data.token);
            
            // Opción 2: Usar js-cookie (mejor que localStorage pero aún vulnerable a XSS)
            Cookies.set('jwt_token_js', data.token, { expires: 1 }); // Expira en 1 día
            
            console.log('Token guardado exitosamente');
            
            // Redirigir al dashboard
          router.push('/dashboard');
          } else {
            setError('No se recibió el token en la respuesta');
          }
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          setError('Error al procesar la respuesta del servidor');
        }
      } else {
        let errorMessage = 'Error al iniciar sesión';

        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          console.error('Error parsing error JSON response:', jsonError);
        }

        setError(errorMessage);
      }
    } catch (apiError) {
      console.error('Error calling login API:', apiError);
      setError('Error de comunicación con el servidor');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/background-login.png')` }}>
        <div className="flex flex-col justify-center px-12 bg-opacity-50 bg-black">
          <h2 className="text-2xl font-bold text-white">Kasukabe Squad</h2>
          <p className="mt-2 text-gray-100">Nos gusta ir a dormir calentitos.</p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div>
            <Image priority src="/logo-kskb.png" alt="Logo Kasukabe Squad" width={500} height={200} />
          </div>

          <div className="mt-7">
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
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
            {error && (
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