# 🐳 DevOps Sandbox: Aplicación de Registro de Personas

¡Bienvenido a tu primer entorno de DevOps! Esta es una aplicación web minimalista y moderna diseñada con una interfaz premium de alto impacto visual (Glassmorphism + Dark Mode) construida con **Node.js, Express y Vanilla JS**.

El objetivo de este proyecto es servir como laboratorio práctico para que aprendas los fundamentos de **Docker** y **Docker Compose**, dos herramientas indispensables en el mundo del DevOps.

---

## 🚀 Conceptos DevOps Aplicados en este Proyecto

Al inspeccionar los archivos del proyecto, verás implementadas varias prácticas del mundo real:

1. **Caché de Capas (Docker Layer Caching)**: En el `Dockerfile`, copiamos primero el `package.json` e instalamos dependencias antes de copiar el resto del código. Si tu código cambia pero no tus dependencias, Docker no vuelve a reinstalar todo, ahorrando muchísimo tiempo de construcción.
2. **Principio de Mínimo Privilegio (Seguridad)**: El contenedor no corre como el usuario administrador `root`. En su lugar, el `Dockerfile` cambia al usuario de sistema seguro `node`. Esto evita posibles fallos de seguridad en servidores de producción.
3. **Mapeo de Puertos**: Aprendemos cómo los puertos del contenedor y de tu computadora anfitriona se comunican usando `puerto_anfitrion:puerto_contenedor` (ej. `3000:3000`).
4. **Prueba de Salud (Healthcheck)**: Configurada en `docker-compose.yml` para monitorear constantemente si la aplicación web sigue respondiendo correctamente y alertar si se cae.

---

## 🛠️ Opción 1: Ejecutar Localmente (Sin Docker)

Para verificar rápidamente la aplicación antes de meterla en un contenedor:

1. Asegúrate de tener instalado [Node.js](https://nodejs.org/).
2. Abre una terminal en la raíz de esta carpeta (`APP_PRUEBA`).
3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
5. Abre en tu navegador la dirección: [http://localhost:3000](http://localhost:3000)

---

## 📦 Opción 2: Empaquetar y Ejecutar con Docker CLI

Aquí es donde empieza el DevOps de verdad. Vamos a empaquetar toda la aplicación dentro de una imagen de Docker autocontenida.

### 1. Construir la Imagen de Docker
Crea la plantilla/imagen de tu aplicación con el tag `-t app-personas`:
```bash
docker build -t app-personas .
```

### 2. Ejecutar la Aplicación en un Contenedor
Corre el contenedor en segundo plano (modo desatendido `-d`) mapeando el puerto 3000 (`-p 3000:3000`):
```bash
docker run -d -p 3000:3000 --name mi_contenedor_personas app-personas
```

### 3. Comandos Útiles de Monitoreo
* **Ver contenedores activos**:
  ```bash
  docker ps
  ```
* **Ver los registros en vivo (Logs) del servidor**:
  ```bash
  docker logs mi_contenedor_personas
  ```
* **Ver logs en tiempo real (Follow)**:
  ```bash
  docker logs -f mi_contenedor_personas
  ```

### 4. Apagar y Limpiar
* **Detener el contenedor**:
  ```bash
  docker stop mi_contenedor_personas
  ```
* **Eliminar el contenedor**:
  ```bash
  docker rm mi_contenedor_personas
  ```

---

## 🎼 Opción 3: Orquestación Simple con Docker Compose (Recomendado)

En lugar de escribir comandos largos de Docker CLI en la consola, **Docker Compose** te permite levantar y apagar todo tu entorno con archivos de configuración declarativos (`docker-compose.yml`).

### 1. Levantar la Aplicación
Este comando construirá la imagen (si no existe o si ha cambiado) y levantará el contenedor de manera automática:
```bash
docker compose up -d --build
```
*El parámetro `-d` hace que corra en segundo plano. La bandera `--build` fuerza a reconstruir si hiciste cambios en el código.*

### 2. Revisar el estado de salud
Usa el siguiente comando para ver si el contenedor está corriendo y si pasó la prueba de salud (`healthcheck`):
```bash
docker compose ps
```
*(Verás en la columna STATUS algo como `Up 45 seconds (healthy)`).*

### 3. Detener y eliminar el entorno
Para apagar el servidor y limpiar los contenedores creados con un solo comando:
```bash
docker compose down
```

---

## 🧑‍💻 Tecnologías Utilizadas
* **Backend**: Node.js & Express (API REST simple y robusta)
* **Frontend**: HTML5 Semántico, CSS Glassmorphism y Vanilla JavaScript (peticiones asíncronas con Fetch API)
* **Iconos**: FontAwesome 6
* **Tipografías**: Google Fonts (Outfit & Plus Jakarta Sans)
