pipeline {
    agent any

    environment {
        DEPLOY_DIR = '/var/www/html'
        BUILD_DIR = 'dist'
        WEB_SERVICE = 'nginx'
        NODE_VERSION = '20'
        VITE_API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net'
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Installing Node.js ${NODE_VERSION} if missing..."
                    if ! command -v node > /dev/null; then
                        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    fi

                    echo "Installing npm if missing..."
                    which npm || sudo apt-get install -y npm
                '''
            }
        }

        stage('Pull Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: 'main']],
                    userRemoteConfigs: [[url: 'https://github.com/eku2307/purple-auth-flow.git']]
                ])
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            steps {
                sh """
                    echo "Cleaning existing deployment at ${DEPLOY_DIR}..."
                    sudo rm -rf ${DEPLOY_DIR}/*

                    echo "Copying build files from ${BUILD_DIR} to ${DEPLOY_DIR}..."
                    sudo cp -r ${BUILD_DIR}/* ${DEPLOY_DIR}/

                    echo "Fixing ownership and permissions..."
                    sudo chown -R www-data:www-data ${DEPLOY_DIR}
                    sudo find ${DEPLOY_DIR} -type d -exec chmod 755 {} \\;
                    sudo find ${DEPLOY_DIR} -type f -exec chmod 644 {} \\;

                    echo "Restarting ${WEB_SERVICE}..."
                    sudo systemctl restart ${WEB_SERVICE}
                """
            }
        }
    }

    post {
        success {
            echo 'Frontend deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check build logs for details.'
        }
        always {
            cleanWs()
        }
    }
}
