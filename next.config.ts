// next.config.ts

const nextConfig = {
  images: {
    domains: ['i.ytimg.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignora los errores de ESLint durante la compilación
  },
  // Tus otras opciones de configuración existentes...
}

export default nextConfig;