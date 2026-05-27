# =====================================================================
# DOCKERFILE - Optimizado y Seguro para Producción / Desarrollo
# =====================================================================

# 1. Usar una imagen base oficial de Node.js ligera basada en Alpine Linux
FROM node:20-alpine

# 2. Definir el entorno del contenedor (Producción por defecto)
ENV NODE_ENV=production
ENV PORT=3000

# 3. Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 4. Copiar package.json y package-lock.json (si existiera)
# Al hacer esto antes de copiar todo el código, Docker puede cachear 
# la capa de dependencias si package.json no ha cambiado. ¡Buena práctica DevOps!
COPY package*.json ./

# 5. Instalar dependencias del proyecto (solo dependencias de producción para ligereza)
RUN npm ci --only=production

# 6. Copiar el resto del código fuente al directorio de trabajo del contenedor
COPY . .

# 7. Asignar la propiedad de los archivos al usuario no-privilegiado "node"
# Por seguridad, nunca debes correr tus aplicaciones web como "root" en producción.
RUN chown -R node:node /usr/src/app

# 8. Cambiar al usuario "node" no-root
USER node

# 9. Informar a Docker el puerto que expone la aplicación
EXPOSE 3000

# 10. Comando de ejecución por defecto al iniciar el contenedor
CMD ["node", "app_de_prueba.js"]
