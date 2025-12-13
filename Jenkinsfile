pipeline {
    agent any

    environment {
        // Use consistent environment variables
        DEPLOY_DIR = '/var/www/html'
        BUILD_DIR = 'dist'
        // Specify the service name explicitly if deploying to a known server
        WEB_SERVICE = 'nginx' 
    }
    // 


    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Installing Node, npm & build tools if missing..."
                    # Ensure Node.js and npm are installed
                    which node || sudo apt-get install -y nodejs npm
                '''
            }
        }

        stage('Pull Code') {
            steps {
                // Use built-in 'checkout' step for better integration
                checkout([
                    $class: 'GitSCM', 
                    branches: [[name: 'main']], 
                    userRemoteConfigs: [[url: 'https://github.com/eku2307/purple-auth-flow.git']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci' // 'npm ci' is preferred and handles the fallback internally
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            steps {
                // Use environment variables and target only the required web service
                sh """
                    echo "Cleaning existing deployment at ${DEPLOY_DIR}..."
                    sudo rm -rf ${DEPLOY_DIR}/*

                    echo "Copying new build files from ${BUILD_DIR}..."
                    sudo cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/

                    echo "Restarting web service: ${WEB_SERVICE}..."
                    sudo systemctl restart ${WEB_SERVICE}
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check build logs for details.'
        }
        always {
            // Optional: Clean up workspace to save space
            cleanWs()
        }
    }
}
