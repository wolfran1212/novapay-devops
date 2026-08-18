# NovaPay DevOps

## Descripción

NovaPay es una API REST desarrollada como parte del laboratorio de
automatización DevOps de la Maestría en Arquitectura de Software.

## Arquitectura

El proyecto utiliza GitHub como sistema de control de versiones,
GitHub Actions para integración continua, Jenkins para entrega continua,
Docker para contenerización y Google Cloud como plataforma de ejecución.

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
