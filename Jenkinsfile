pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/www/html'
        BUILD_DIR = 'dist' // Vite outputs to 'dist' by default
    }

    stages {
        stage('Pull Code') {
            steps {
                git branch: 'main', url: 'https://github.com/eku2307/purple-auth-flow.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci' // cleaner than npm install for CI
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Nginx') {
            steps {
                script {
                    if (!fileExists(BUILD_DIR)) {
                        error "Build directory '${BUILD_DIR}' not found!"
                    }
                    sh "rm -rf ${DEPLOY_DIR}/*"
                    sh "cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
