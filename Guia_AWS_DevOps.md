# 🚀 Guía Práctica de DevOps en AWS: De Local a la Nube

Esta guía detalla el paso a paso para tomar tu aplicación Dockerizada local y desplegarla en Amazon Web Services (AWS), cubriendo la creación del servidor, balanceo de carga y registro de contenedores.

---

## 1. Despliegue en EC2 (Elastic Compute Cloud)

EC2 es un servidor virtual en la nube de Amazon. Es el lugar físico donde correrá tu contenedor.

### Creación de la Instancia
1. En la consola de AWS, busca **EC2** y haz clic en **Launch instance**.
2. **Nombre**: `servidor-docker`
3. **AMI (Sistema Operativo)**: Ubuntu (recomendado para principiantes en Docker).
4. **Tipo de instancia**: `t2.micro` (Capa gratuita).
5. **Key pair**: Crea uno nuevo, guárdalo bien (`.pem`). Es tu llave SSH.
6. **Network settings**:
   * Permitir tráfico SSH (Puerto 22).
   * Permitir tráfico HTTP desde internet (Puerto 80).
   * *Importante*: Agrega una regla **Custom TCP** para el puerto **3000** permitiendo el acceso desde `Anywhere-IPv4` (`0.0.0.0/0`).

### Conexión y Preparación del Servidor
Desde tu terminal local donde guardaste el `.pem`:
```bash
ssh -i "tu-llave.pem" ubuntu@TU_IP_PUBLICA
```

Una vez dentro del servidor, instala Docker y Git:
```bash
sudo apt update
sudo apt install git docker.io -y
sudo systemctl start docker
sudo systemctl enable docker
```

### Ejecutar la Aplicación
1. Clona el repositorio desde GitHub:
   ```bash
   git clone https://github.com/DavidArmando/ejercicio-docker-personas.git
   cd ejercicio-docker-personas
   ```
2. Construye y corre el contenedor:
   ```bash
   sudo docker build -t mi-app-docker .
   sudo docker run -d -p 3000:3000 --name servidor_web mi-app-docker
   ```

Tu app ya es visible en `http://TU_IP_PUBLICA:3000`.

---

## 2. Configurar un Application Load Balancer (ALB)

Un ALB distribuye el tráfico y expone tu app por el puerto estándar HTTP (80) sin mostrar el puerto interno 3000.

### Fase A: Crear el Target Group
1. Ve a EC2 > **Target Groups** > **Create target group**.
2. **Type**: Instances.
3. **Protocol & Port**: HTTP / **3000**.
4. **Health Check**: Ruta `/`.
5. En la siguiente pantalla, selecciona tu instancia EC2 y haz clic en **Include as pending below**. Crea el grupo.

### Fase B: Crear el Load Balancer
1. Ve a **Load Balancers** > **Create Load Balancer** > **Application Load Balancer**.
2. **Scheme**: Internet-facing.
3. **Mappings**: Selecciona al menos dos Availability Zones.
4. **Security Groups**: Asegúrate de tener una regla que permita HTTP por el puerto 80 desde `0.0.0.0/0`.
5. **Listeners**: En el puerto 80, selecciona hacer *Forward* (redirigir) hacia tu Target Group.
6. Crea el ALB, espera a que esté activo y usa el **DNS Name** para acceder a tu app en el navegador sin poner el puerto 3000.

---

## 3. Uso de Amazon ECR (Elastic Container Registry)

ECR es un repositorio privado en AWS para guardar imágenes de Docker ya construidas, similar a Docker Hub pero privado.

### Creación del Repositorio
1. En AWS, busca **ECR** > **Create repository**.
2. **Visibility**: Private.
3. **Name**: `app-personas-docker`.

### Subir tu Imagen (Push)
1. Entra al repositorio creado y haz clic en **View push commands** (Ver comandos de envío).
2. **Autenticación**: Ejecuta el comando de autenticación de AWS CLI en tu terminal local.
3. **Construir**: Compila tu imagen localmente.
   ```bash
   docker build -t app-personas-docker .
   ```
4. **Etiquetar (Tag)**: Renombra tu imagen para que apunte a AWS.
   ```bash
   docker tag app-personas-docker:latest 123456789.dkr.ecr.REGION.amazonaws.com/app-personas-docker:latest
   ```
5. **Empujar (Push)**: Sube la imagen a ECR.
   ```bash
   docker push 123456789.dkr.ecr.REGION.amazonaws.com/app-personas-docker:latest
   ```

Una vez en ECR, tu servidor EC2 solo necesita descargarla con `docker pull` y ejecutarla, simplificando todo el flujo DevOps.
