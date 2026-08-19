# NovaPay DevOps

## Descripción

NovaPay es una API REST desarrollada como parte del laboratorio de
automatización DevOps de la Maestría en Arquitectura de Software.

## Tecnologías utilizadas

| Herramienta                        | Función                                             |
| :--------------------------------- | :-------------------------------------------------- |
| **GitHub**                         | Control de versiones y gestión del código fuente    |
| **GitHub Actions**                 | Automatización del pipeline de integración continua |
| **Jenkins**                        | Definición del pipeline de entrega continua         |
| **Node.js**                        | Plataforma para el desarrollo de la aplicación      |
| **Express.js**                     | Framework para la construcción de la API            |
| **Jest**                           | Ejecución de pruebas automatizadas                  |
| **ESLint**                         | Análisis estático de código                         |
| **Docker**                         | Contenerización de la aplicación                    |
| **Google Artifact Registry**       | Almacenamiento de imágenes Docker                   |
| **Google Kubernetes Engine (GKE)** | Plataforma objetivo para despliegue futuro          |

## Arquitectura

El proyecto utiliza GitHub como sistema de control de versiones,
GitHub Actions para integración continua, Jenkins para entrega continua,
Docker para contenerización y Google Cloud como plataforma de ejecución.

```
                    ┌───────────────┐
                    │  Desarrollador│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │    GitHub     │
                    └───────┬───────┘
                            │
                     push / pull request
                            │
                            ▼
                 ┌─────────────────────┐
                 │   GitHub Actions    │
                 │                     │
                 │ Checkout            │
                 │ Node.js             │
                 │ npm ci              │
                 │ lint                │
                 │ audit               │
                 │ npm test            │
                 └──────────┬──────────┘
                            │
                            ▼
                     ┌────────────┐
                     │   Jenkins  │
                     │            │
                     │ Checkout   │
                     │ npm ci     │
                     │ Lint       │
                     │ Tests      │
                     │ Docker     │
                     └─────┬──────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Artifact Registry  │
                 └──────────┬─────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │   Kubernetes   │
                   │                │
                   │  NovaPay API   │
                   │   replicas: 2  │
                   └────────────────┘
```

## Estructura del proyecto

```
novapay-devops/
├── .github/
│   └── workflows/
│       └── ci.yml            Pipeline de integración continua
├── k8s/
│   ├── deployment.yaml       Deployment con 2 réplicas y probes
│   └── service.yaml          Service de tipo LoadBalancer
├── src/
│   └── app.js                Definición de la aplicación Express
├── test/
│   └── app.test.js           Pruebas de los endpoints con Jest y Supertest
├── .dockerignore
├── .gitignore
├── Dockerfile                Imagen de la aplicación
├── Jenkinsfile               Pipeline de entrega continua
├── README.md
├── eslint.config.js          Configuración de ESLint (flat config)
├── package.json
├── package-lock.json
└── server.js                 Punto de entrada del servidor HTTP
```

## CI

El pipeline de GitHub Actions ejecuta:

1. Checkout del código.
2. Configuración de Node.js.
3. Instalación de dependencias.
4. Análisis estático con ESLint (`npm run lint`).
5. Auditoría de seguridad de dependencias (`npm audit --audit-level=high`).
6. Ejecución de pruebas.

La auditoría está marcada con `continue-on-error`, de modo que una
vulnerabilidad transitiva queda registrada en el log sin detener la build.

## CD

El pipeline Jenkins contempla:

1. Clonación del repositorio.
2. Instalación de dependencias.
3. Análisis estático con ESLint.
4. Pruebas.
5. Construcción de imagen Docker.
6. Publicación en el registro de imágenes.
7. Despliegue en Kubernetes.

La imagen se etiqueta con el número de build (`BUILD_NUMBER`) además de
`latest`, para poder volver a una versión anterior ante un despliegue
fallido.

Los stages de publicación y despliegue están envueltos en `catchError` de
tipo `UNSTABLE`: en un Jenkins local sin credenciales de nube la corrida
llega hasta el final y esos dos stages quedan marcados como inestables en
lugar de abortar el pipeline.

### Variables de entorno del pipeline

| Variable     | Valor por defecto              | Descripción                                  |
| :----------- | :----------------------------- | :------------------------------------------- |
| `REGISTRY`   | `us-central1-docker.pkg.dev`   | Host del registro de imágenes de contenedores |
| `PROJECT_ID` | `novapay-project`              | Proyecto o namespace dentro del registro      |

Ambas se leen del entorno de Jenkins y sólo caen al valor por defecto si no
están definidas. Esto mantiene el pipeline agnóstico del proveedor: para
publicar en otro registro (Docker Hub, ECR, ACR) o desplegar en otro
clúster basta con definirlas como variables de entorno o parámetros del
job, sin editar el `Jenkinsfile`.

El manifiesto `k8s/deployment.yaml` usa el placeholder `IMAGE_NOVAPAY`, que
el stage de despliegue sustituye con `sed` por la imagen recién construida.

## Ejecución local

### Instalación

```bash
npm ci
```

### Pruebas

```bash
npm test
```

### Análisis estático

```bash
npm run lint
npm run lint:fix   # corrige automáticamente lo que sea corregible
```

### Servidor de desarrollo

```bash
npm start
# API disponible en http://localhost:3000
```

### Docker

```bash
docker build -t novapay-api:test .
docker run --rm -d -p 3000:3000 --name novapay-test novapay-api:test

curl http://localhost:3000/
curl http://localhost:3000/test

docker stop novapay-test
```

La imagen se construye con `npm ci --omit=dev`, corre con el usuario sin
privilegios `node` e incluye un `HEALTHCHECK` contra `/test`.

### Kubernetes

```bash
# Sustituir el placeholder por una imagen real antes de aplicar
sed -i "s|IMAGE_NOVAPAY|novapay-api:test|g" k8s/deployment.yaml

kubectl apply -f k8s/
kubectl rollout status deployment/novapay-api
```

## Endpoints

| Método | Ruta    | Respuesta                                                          |
| :----- | :------ | :----------------------------------------------------------------- |
| `GET`  | `/`     | `{ "application": "NovaPay API", "version": "1.0.0", "status": "running" }` |
| `GET`  | `/test` | `{ "status": "OK" }`                                                |
