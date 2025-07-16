# backend-services/auth-service/Dockerfile

# 1. Usa una imagen de Node que incluya las herramientas de compilación
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copia solo los package.json y package-lock.json para cachear las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el código TypeScript
RUN npm run build

# 2. Crea una imagen final más ligera solo con lo necesario para producción
FROM node:22-alpine

WORKDIR /usr/src/app

# Copia las dependencias de producción desde la etapa de construcción
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia el código compilado desde la etapa de construcción
COPY --from=builder /usr/src/app/dist ./dist
# Copia el package.json para que Node sepa que es un módulo (`type: "module"`)
COPY package.json . 

# Expone el puerto y ejecuta la aplicación
EXPOSE 8001
CMD ["node", "dist/server.js"]