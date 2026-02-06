pipeline{
    agent any

    environment {
        IMAGE_NAME = "sahilmahat/service-status-dashboard:latest"
    }

    stages{
        stage("check out"){
            steps{
                checkout scm
            }
        }
        stage("docker build "){
            steps{
                sh  '''
                docker build -t sahilmahat/service-status-dashboard:latest .
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
                  docker push sahilmahat/service-status-dashboard:latest
                '''
            }
        }
        stage("Update Dashboard") {
            steps {
                sh """
                  curl -X POST http://3.110.139.212:5000/api/deploy-info \
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
    



