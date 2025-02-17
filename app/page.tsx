"use client";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // Seguridad para SSR/SSG
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        router.push('/login');
      } else {
        validateToken(token).then((validationResult) => {
          if (validationResult.isValid) {
            router.push('/dashboard');
          } else {
            router.push('/login');
          }
        });
      }
    }
  }, []);

  return null;
}

// Función asíncrona para validar el token con el backend
async function validateToken(token: string): Promise<{ isValid: boolean }> {

  const backendValidationEndpoint = 'http://localhost:8080/api/validation/token';
  try {
    const response = await fetch(backendValidationEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { isValid: true };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    console.error('Error al validar el token con el backend:', error);
    return { isValid: false };
  }
}