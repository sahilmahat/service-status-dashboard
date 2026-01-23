pipeline{
    agent any

    environment {
        IMAGE_NAME = "snesh111/service-status-dashboard:latest"
    }

    stages{
        stage("check out"){
            steps{
                checkout scm
            }
        }
        stage("install Dependence "){
            steps{
                sh 'npm install'
            }
        }
        stage("docker build "){
            steps{
                sh  '''
                docker build -t snesh111/service-status-dashboard:latest .
                '''
            }
        }
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      echo $DOCKER_PASS | docker login -u  $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                  docker push snesh111/service-status-dashboard:latest
                '''
            }
        }
        stage("Update Dashboard") {
            steps {
                sh """
                  curl -X POST http://3.111.213.40/api/deploy-info \
                  -H "Content-Type: application/json" \
                  -d '{
                    "build": "${BUILD_NUMBER}",
                    "version": "v${BUILD_NUMBER}"
                  }'
                """
            }
        }
    }
}
    



