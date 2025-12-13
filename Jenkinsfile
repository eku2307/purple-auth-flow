pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/www/html'
        BUILD_DIR = 'dist'
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Installing Node, npm & build tools if missing..."
                    which node || sudo apt-get install -y nodejs npm
                '''
            }
            
        }

        stage('Pull Code') {
            steps {
                git branch: 'main', url: 'https://github.com/eku2307/purple-auth-flow.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing dependencies..."
                    npm ci || npm install
                '''
            }
        }

        stage('Build Project') {
            steps {
                sh '''
                    echo "Building project..."
                    npm run build
                '''
            }
        }

        stage('Deploy to Server') {
            steps {
                sh '''
                    echo "Cleaning existing deployment..."
                    sudo rm -rf ${DEPLOY_DIR}/*

                    echo "Copying new build files..."
                    sudo cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/

                    echo "Restarting web server..."
                    sudo systemctl restart nginx || sudo systemctl restart apache2
                '''
            }
        }
        stage('Deploy to Nginx') {
             steps {
                 sh '''
                     sudo rm -rf /var/www/html/*
                     sudo cp -r dist/* /var/www/html/
        '''
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
