# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el código antes de instalar dependencias
COPY . . 

# Instala las dependencias
RUN npm install

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
