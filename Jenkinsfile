pipeline {

    agent any

    environment {

        // Valores parametrizables: se toman del entorno de Jenkins si estan
        // definidos y, si no, caen a un valor por defecto. Esto mantiene el
        // pipeline agnostico del proveedor de nube.
        REGISTRY   = "${env.REGISTRY ?: 'us-central1-docker.pkg.dev'}"
        PROJECT_ID = "${env.PROJECT_ID ?: 'novapay-project'}"
        REPOSITORY = 'novapay'
        IMAGE_NAME = 'novapay-api'

        // Etiqueta por numero de build en lugar de latest, para poder hacer
        // rollback a una version anterior de la imagen.
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        IMAGE_FULL = "${REGISTRY}/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}"

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

        stage('Analisis Estatico') {
            steps {
                sh 'npm run lint'
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
                        -t ${IMAGE_FULL}:${IMAGE_TAG} \
                        -t ${IMAGE_FULL}:latest .
                '''
            }
        }

        stage('Publicar Imagen') {
            steps {
                // En produccion la autenticacion se resuelve con el
                // withCredentials de Jenkins, por ejemplo:
                //
                //   withCredentials([file(credentialsId: 'gcp-sa-key',
                //                         variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                //       sh 'gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS'
                //       sh 'gcloud auth configure-docker ${REGISTRY} --quiet'
                //   }
                //
                // El catchError deja el stage en UNSTABLE cuando se corre en un
                // Jenkins local sin credenciales, sin abortar la ejecucion.
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    sh '''
                        gcloud auth configure-docker ${REGISTRY} --quiet
                        docker push ${IMAGE_FULL}:${IMAGE_TAG}
                        docker push ${IMAGE_FULL}:latest
                    '''
                }
            }
        }

        stage('Desplegar en Kubernetes') {
            steps {
                // Sustituye el placeholder IMAGE_NOVAPAY del manifiesto por la
                // imagen recien publicada y aplica los manifiestos. Requiere un
                // kubeconfig valido en el agente, por lo que se trata igual que
                // el stage anterior: inestable en local, sin abortar la corrida.
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    sh '''
                        sed -i "s|IMAGE_NOVAPAY|${IMAGE_FULL}:${IMAGE_TAG}|g" k8s/deployment.yaml
                        kubectl apply -f k8s/
                        kubectl rollout status deployment/novapay-api --timeout=120s
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline NovaPay ejecutado correctamente'
        }

        failure {
            echo 'Pipeline NovaPay presento un error'
        }

        always {
            // cleanWs() depende del plugin Workspace Cleanup; si no esta
            // instalado se deja constancia en el log sin fallar el build.
            script {
                try {
                    cleanWs()
                } catch (Exception e) {
                    echo 'Plugin de limpieza no disponible, se conserva el workspace'
                }
            }
        }
    }
}
