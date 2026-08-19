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
| **Docker**                         | Contenerización de la aplicación                    |
| **Google Artifact Registry**       | Almacenamiento de imágenes Docker                   |
| **Google Kubernetes Engine (GKE)** | Plataforma objetivo para despliegue futuro          |

## Arquitectura

El proyecto utiliza GitHub como sistema de control de versiones,
GitHub Actions para integración continua, Jenkins para entrega continua,
Docker para contenerización y Google Cloud como plataforma de ejecución.

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
                 │ npm test            │
                 └──────────┬──────────┘
                            │
                            ▼
                     ┌────────────┐
                     │   Jenkins  │
                     │            │
                     │ Checkout   │
                     │ npm ci     │
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

## CI

El pipeline de GitHub Actions ejecuta:

1. Checkout del código.
2. Configuración de Node.js.
3. Instalación de dependencias.
4. Ejecución de pruebas.

## CD

El pipeline Jenkins contempla:

1. Clonación del repositorio.
2. Instalación de dependencias.
3. Pruebas.
4. Construcción de imagen Docker.
5. Publicación en Google Artifact Registry.
6. Despliegue en Kubernetes.

## Endpoints

GET /

GET /test
