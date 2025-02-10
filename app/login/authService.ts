// app/login/authService.ts (o .js)
export async function fakeLogin(username: string, password: string): Promise<{ token?: string; error?: string }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'usuario' && password === 'contraseña') {
          // Simulación de login exitoso
          resolve({ token: 'AWJ_TOKEN_SIMULADO_EXITOSO' }); // Reemplaza esto con la lógica real cuando tengas el backend
        } else {
          // Simulación de login fallido
          resolve({ error: 'Credenciales inválidas' }); // Simula un error de credenciales
        }
      }, 1500); // Simula un retraso de 1.5 segundos (como una llamada a la API)
    });
  }