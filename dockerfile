# Usa una imagen base de Node.js
FROM node:20-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el código antes de instalar dependencias
COPY . . 

# Recoge por argumentos las variables de entorno y las settea como tales.
ARG NEXT_PUBLIC_YOUTUBE_API_KEY
ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_YOUTUBE_API_KEY=$NEXT_PUBLIC_YOUTUBE_API_KEY
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST

RUN printenv | grep NEXT_PUBLIC # Para verificar durante la construcción

# Instala las dependencias
RUN npm install

RUN printenv | grep NEXT_PUBLIC

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
