pipeline {

    agent any

    environment {

        PROJECT_ID = 'XXXXXXXXX'
        REGION = 'us-central1'
        REPOSITORY = 'novapay'
        IMAGE_NAME = 'novapay-api'

    }

    stages {

        stage('Clonar Repositorio') {
            steps {
                checkout scm
            }
        }

        stage('Instalar Dependencias') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Ejecutar Pruebas') {
            steps {
                sh 'npm test'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                sh '''
                    docker build \
                    -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:latest .
                '''
            }
        }

        stage('Publicar Imagen') {
            steps {
                echo 'Publicar imagen en Google Artifact Registry'
            }
        }

        stage('Desplegar en Kubernetes') {
            steps {
                echo 'Desplegar aplicación en Google Kubernetes Engine'
            }
        }
    }

    post {
        success {
            echo 'Pipeline NovaPay ejecutado correctamente'
        }

        failure {
            echo 'Pipeline NovaPay presentó un error'
        }
    }
}