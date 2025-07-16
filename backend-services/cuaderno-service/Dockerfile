# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de manifiesto y bloqueo para cachear las dependencias
COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build


# Etapa de producción
FROM node:22-alpine

WORKDIR /usr/src/app

# Copia solo las dependencias de producción desde la etapa de construcción
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia el código JavaScript compilado
COPY --from=builder /usr/src/app/dist ./dist

# Copia el package.json para que Node sepa que es un módulo
COPY package.json .

# Expone el puerto y define el comando de inicio
EXPOSE 8002
CMD ["node", "dist/server.js"]