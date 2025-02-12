import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('awj_token')?.value; // Obtiene el token de las cookies

  if (!token) {
    // No hay token en las cookies, redirige a login inmediatamente (server-side)
    redirect('/login');
  }

  // Si hay token, vamos a validarlo con el backend
  const validationResult = await validateToken(token);

  if (validationResult.isValid) {
    // Token válido según el backend, redirige al dashboard
    redirect('/dashboard');
  } else {
    // Token inválido o error en la validación, redirige a login
    redirect('/login');
  }

  // Opcionalmente, podrías renderizar algo aquí mientras se redirige, aunque la redirección server-side es muy rápida
  return (
    <div>
      <p>Redirigiendo...</p>
    </div>
  );
}

// Función asíncrona para validar el token con el backend (simulación por ahora)
async function validateToken(token: string): Promise<{ isValid: boolean }> {
  // Aquí iría la llamada real a tu backend para validar el token
  // Por ahora, vamos a simular una validación exitosa siempre para este ejemplo.
  // ¡REEMPLAZA ESTO CON LA LÓGICA REAL DE VALIDACIÓN DE TU BACKEND!

  const backendValidationEndpoint = 'http://localhost:8080/api/auth/validate-token'; // Reemplaza con la URL real de tu backend
  try {
    const response = await fetch(backendValidationEndpoint, {
      method: 'POST', // o GET, dependiendo de cómo esté diseñada tu API de validación
      headers: {
        'Authorization': `Bearer ${token}`, // Envía el token en la cabecera Authorization (típico para JWT)
        'Content-Type': 'application/json', // Ajusta el Content-Type según lo que espere tu backend
      },
      // Si tu backend espera el token en el body, puedes usar la opción 'body': JSON.stringify({ token })
    });

    if (response.ok) {
      // Código 2xx indica validación exitosa (ajusta según la respuesta real de tu backend)
      return { isValid: true };
    } else {
      // Cualquier otro código de respuesta (ej. 401, 403) indica token inválido
      return { isValid: false };
    }
  } catch (error) {
    // Error de red o al contactar con el backend, considera el token como inválido (o maneja el error como prefieras)
    console.error('Error al validar el token con el backend:', error);
    return { isValid: false }; // En caso de error, redirigimos a login por seguridad
  }
}