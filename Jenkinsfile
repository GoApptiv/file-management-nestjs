pipeline {
    agent any

    environment {
        DIR_NAME = "file-management-nestjs"
        GCR_REGISTRY = "asia.gcr.io"
        GCR_PROJECT_ID = "goapptiv/file-management"
        GCR_IMAGE_NAME = "file-management-nestjs"
        CLOUD_RUN_REGION = "asia-south1"
        CLOUD_RUN_SERVICE_NAME = "file-management-nestjs"
        CLOUD_RUN_SQL_CONNECTION_NAME = "oceanic-bindery-327007:asia-south1:file-management-production"
        CLOUD_RUN_MAX_INSTANCES = 6
        CLOUD_RUN_MEMORY = "2Gi"
        CLOUD_RUN_CPU = 1
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                script {
                    env.TAG_NAME = sh(returnStdout: true, script: 'git tag --sort version:refname | tail -1').trim()
                }
            }
        }

        stage("Write secret file") {
            steps {
                // Read the secret file credential
                withCredentials([file(credentialsId: 'file-management-nestjs-env', variable: 'SECRET_FILE_PATH')]) {
                    // Write the secret file to disk
                    writeFile file: '.env', text: readFile(SECRET_FILE_PATH)
                }
            }
        }

        stage("Activate Service Account") {
            steps {
                // Read the service account credential
                withCredentials([file(credentialsId: 'proj-goapptiv-gcr-deployer-sa-key', variable: 'SERVICE_ACCOUNT')]) {
                    // Activate the service account
                    sh 'gcloud auth activate-service-account --key-file="${SERVICE_ACCOUNT}"'
                }
            }
        }

        stage("Build Docker Image") {
            steps {
                script {
                    def TAG_NAME = env.TAG_NAME
                    // Build Docker Image
                    withCredentials([string(credentialsId: 'goapptiv-npm-github-token', variable: 'NPM_GITHUB_TOKEN')]) {
                        sh 'docker build -t ${GCR_REGISTRY}/${GCR_PROJECT_ID}/${GCR_IMAGE_NAME}:${TAG_NAME} -t ${GCR_REGISTRY}/${GCR_PROJECT_ID}/${GCR_IMAGE_NAME}:latest . --build-arg NPM_GITHUB_TOKEN=${NPM_GITHUB_TOKEN}'
                    }
                }
            }
        }

        stage("Push Docker Image") {
            steps {
                sh 'gcloud auth configure-docker ${GCR_REGISTRY} --quiet'
                sh 'docker push -a ${GCR_REGISTRY}/${GCR_PROJECT_ID}/${GCR_IMAGE_NAME}'
            }
        }

        stage("Deploy to Cloud Run") {
            steps {

                withCredentials([file(credentialsId: 'proj-goapptiv-cloud-run-sa-key', variable: 'SERVICE_ACCOUNT_KEY_PATH')]) {

                    script {
                        // Read the contents of the file into a String
                        def serviceAccountKeyJson = readFile(SERVICE_ACCOUNT_KEY_PATH).trim()

                        // Parse the JSON to get the client_email
                        def serviceAccountData = readJSON text: serviceAccountKeyJson

                        // encode the service account key to base64
                        def encodedKey = serviceAccountKeyJson.bytes.encodeBase64().toString()

                        env.SERVICE_ACCOUNT_EMAIL = serviceAccountData.client_email

                        env.CLOUD_RUN_SERVICE_ACCOUNT_KEY_CONTENT = encodedKey
                    }

                    sh 'gcloud auth activate-service-account --key-file="${SERVICE_ACCOUNT_KEY_PATH}"'

                    sh '''
                        gcloud run deploy ${CLOUD_RUN_SERVICE_NAME} \\
                            --image ${GCR_REGISTRY}/${GCR_PROJECT_ID}/${GCR_IMAGE_NAME}:latest \\
                            --platform managed \\
                            --region ${CLOUD_RUN_REGION} \\
                            --allow-unauthenticated \\
                            --add-cloudsql-instances ${CLOUD_RUN_SQL_CONNECTION_NAME} \\
                            --service-account ${SERVICE_ACCOUNT_EMAIL} \\
                            --set-env-vars="KEY_FILE_CONTENT=${CLOUD_RUN_SERVICE_ACCOUNT_KEY_CONTENT}" \\
                            --max-instances ${CLOUD_RUN_MAX_INSTANCES} \\
                            --memory ${CLOUD_RUN_MEMORY} \\
                            --cpu ${CLOUD_RUN_CPU} \\
                    '''
                }
            }
        }
    }

    post {
        success {
            mail to: 'sagar.vaghela@goapptiv.com',
                subject: "Pipeline Successful: ${env.JOB_NAME}",
                body: "Your Jenkins pipeline ${env.JOB_NAME} has completed successfully.\nBuild Number: ${env.BUILD_NUMBER}\nDuration: ${currentBuild.durationString}\nStatus: SUCCESS"
        }
        failure {
            mail to: 'sagar.vaghela@goapptiv.com',
                subject: "Pipeline Failed: ${env.JOB_NAME}",
                body: "Your Jenkins pipeline ${env.JOB_NAME} has failed. Please check the console output for more details.\nBuild Number: ${env.BUILD_NUMBER}\nDuration: ${currentBuild.durationString}\nStatus: FAILURE"
        }
        always{
            cleanWs()
            script{
                sh 'rm -f .env'
                sh 'docker image prune -f -a'
            }
        }
    }
}
