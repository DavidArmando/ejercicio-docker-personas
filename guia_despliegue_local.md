# Guía de Despliegue Local: App de Personas (Solo Docker)

Esta guía te ayudará a desplegar tu aplicación utilizando directamente los comandos de Docker, centrándonos en el `Dockerfile` que has creado.

## 1. Requisitos Previos

Asegúrate de tener instalado **Docker Desktop** (en Windows/Mac) o **Docker Engine** (en Linux). Puedes verificarlo ejecutando:

```powershell
docker --version
```

## 2. Construir la Imagen de Docker

El primer paso es crear una "imagen" a partir de tu código. Ejecuta este comando en la raíz de tu proyecto (donde está el archivo `Dockerfile`):

```powershell
docker build -t app-personas-devops .
```

*   `-t app-personas-devops`: Le da el nombre (tag) `app-personas-devops` a tu imagen.
*   `.`: Indica que el contexto de construcción es el directorio actual.

## 3. Ejecutar el Contenedor

Una vez creada la imagen, puedes iniciar un contenedor basado en ella:

```powershell
docker run -d --name mi-app-devops -p 3000:3000 app-personas-devops
```

### Explicación de los parámetros:
*   `-d`: Ejecuta el contenedor en segundo plano (detached mode).
*   `--name mi-app-devops`: Le asigna un nombre amigable al contenedor para que sea fácil identificarlo.
*   `-p 3000:3000`: Mapea el puerto 3000 de tu computadora al puerto 3000 del contenedor.
*   `app-personas-devops`: El nombre de la imagen que construimos en el paso anterior.

## 4. Verificación

### Acceso Web
Abre tu navegador y entra a:
[http://localhost:3000](http://localhost:3000)

### Probar el API (Healthcheck)
Puedes probar si la lista de personas responde correctamente:
[http://localhost:3000/api/people](http://localhost:3000/api/people)

### Ver logs del contenedor
Si algo no funciona, puedes ver qué está pasando dentro del contenedor:
```powershell
docker logs mi-app-devops
```

## 5. Mantenimiento y Limpieza

### Detener el contenedor
```powershell
docker stop mi-app-devops
```

### Eliminar el contenedor
```powershell
docker rm mi-app-devops
```

### Eliminar la imagen (si ya no la necesitas)
```powershell
docker rmi app-personas-devops
```

---
> [!TIP]
> Si realizas cambios en tu código (`app_de_prueba.js`), recuerda que debes volver a ejecutar el paso de **Construir la Imagen** para que los cambios se reflejen en Docker.
