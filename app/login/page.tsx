'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  Transition, 
  TransitionChild 
} from '@headlessui/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordTooltip, setForgotPasswordTooltip] = useState(false);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Registration state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationUsername, setRegistrationUsername] = useState('');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [registrationPassword, setRegistrationPassword] = useState('');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(null);

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
        credentials: 'include'
      });
  
      if (response.ok) {
        try {
          const data = await response.json();
          
          if (data.token) {
            localStorage.setItem('jwt_token', data.token);
            Cookies.set('jwt_token_js', data.token, { expires: 1 });
            
            console.log('Token guardado exitosamente');
            
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
          // Si hay un error de parsing, mantenemos el mensaje genérico
        }
  
        setError(errorMessage);
      }
    } catch (apiError) {
      console.error('Error calling login API:', apiError);
      setError('Error de comunicación con el servidor');
    }
  };

  const handleRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegistrationError(null);
    setRegistrationSuccess(null);

    // Basic validation
    if (!registrationUsername || !registrationEmail || !registrationPassword) {
      setRegistrationError('Por favor, complete todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: registrationUsername,
          email: registrationEmail,
          password: registrationPassword
        })
      });
  
      try {
        const responseData = await response.json();
  
        if (response.ok) {
          setRegistrationSuccess('Usuario registrado exitosamente');
          setRegistrationSuccess('Usuario registrado exitosamente');
        } else {
          setRegistrationError(responseData.error || responseData.message || 'Error al registrar usuario');
        }
      } catch (jsonError) {
        console.error('Error parsing registration error JSON response:', jsonError);
        setRegistrationError('Error al procesar la respuesta del servidor');
      }
    } catch (apiError) {
      console.error('Error calling registration API:', apiError);
      setRegistrationError('Error de comunicación con el servidor');
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Clear any existing timer
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }

    // Show tooltip
    setForgotPasswordTooltip(true);
    
    // Set a new timer to hide tooltip after 3 seconds
    tooltipTimerRef.current = setTimeout(() => {
      setForgotPasswordTooltip(false);
    }, 3000);
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/background-login.png')` }}>
        <div className="flex flex-col justify-center px-12 bg-opacity-50 bg-black">
          <h2 className="text-2xl font-bold text-white">Kasukabe Squad</h2>
          <p className="mt-2 text-gray-100">Nos gusta ir a dormir calentitos.</p>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 justify-center items-center px-6 lg:px-8 relative">
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
                <div className="text-sm relative">
                  <a 
                    href="#" 
                    onClick={handleForgotPasswordClick}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                  {forgotPasswordTooltip && (
                    <div className="absolute z-10 top-full mt-2 left-0 bg-gray-800 text-white text-sm rounded-md p-2 shadow-lg animate-fade-in">
                      Pues mala suerte. Pregúntale a Nené a ver si te la resetea.
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <a 
                    href="#" 
                    onClick={() => setIsModalOpen(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Registro
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

      {/* Registro Modal */}
      <Transition show={isModalOpen}>
        <Dialog onClose={() => setIsModalOpen(false)} className="relative z-50">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </TransitionChild>

          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Registro de Usuario
                </DialogTitle>
                <form onSubmit={handleRegistration} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="registration-username" className="block text-sm font-medium text-gray-700">
                      Nombre de usuario
                    </label>
                    <input
                      id="registration-username"
                      type="text"
                      value={registrationUsername}
                      onChange={(e) => setRegistrationUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" // Añadido padding
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="registration-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="registration-email"
                      type="email"
                      value={registrationEmail}
                      onChange={(e) => setRegistrationEmail(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" // Añadido padding
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="registration-password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <input
                      id="registration-password"
                      type="password"
                      value={registrationPassword}
                      onChange={(e) => setRegistrationPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2" // Añadido padding
                      required
                    />
                  </div>
                  {registrationError && (
                    <div className="text-red-500 text-sm">
                      {registrationError}
                    </div>
                  )}
                  {registrationSuccess && (
                    <div className="text-green-500 text-sm">
                      {registrationSuccess}
                    </div>
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    >
                      Registrarse
                    </button>
                    </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}