pipeline {
    agent any

    environment {
        DEPLOY_DIR   = '/var/www/html'
        BUILD_DIR    = 'dist'
        WEB_SERVICE  = 'nginx'
        NODE_VERSION = '20'
        VITE_API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net'
        SSH_KEY      = '/var/lib/jenkins/.ssh/novapay_key_pair.pem'
        FRONTEND_EC2 = 'ubuntu@16.171.241.145'
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    set -e
                    echo "Updating system packages..."
                    sudo apt-get update -y || true

                    echo "Installing Node.js if missing..."
                    if ! command -v node >/dev/null 2>&1; then
                        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    fi

                    node -v
                    npm -v
                '''
            }
        }

        stage('Pull Code') {
            steps {
                checkout scm
            }
        }

        stage('Clean Old Build & Cache') {
            steps {
                sh '''
                    rm -rf ${BUILD_DIR}
                    rm -rf node_modules/.vite || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Debug Vite Env') {
            steps {
                sh '''
                    echo "==== ENV FILES ===="
                    ls -la .env* || true

                    echo "==== VITE VARS ===="
                    env | grep VITE || true
                '''
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Frontend EC2') {
            steps {
                sh '''
                    echo "Deploying to frontend EC2 with sudo permissions..."

                    # Test SSH connection
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${FRONTEND_EC2} "echo Connection successful"

                    # Rsync using sudo on remote
                    rsync -avz \
                        -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
                        --rsync-path="sudo rsync" \
                        --delete \
                        ${BUILD_DIR}/ ${FRONTEND_EC2}:${DEPLOY_DIR}/

                    # Restart nginx
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${FRONTEND_EC2} "sudo systemctl restart nginx"
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend deployment completed successfully'
        }
        failure {
            echo 'Deployment failed'
        }
        always {
            cleanWs()
        }
    }
}
