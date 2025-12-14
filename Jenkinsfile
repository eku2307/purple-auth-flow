pipeline {
    agent any

    environment {
        DEPLOY_DIR       = '/var/www/html'
        BUILD_DIR        = 'dist'
        WEB_SERVICE      = 'nginx'
        NODE_VERSION     = '20'
        VITE_API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net'
        SSH_KEY_PATH     = '/var/lib/jenkins/.ssh/novapay_key_pair.pem'
        FRONTEND_EC2_IP  = '16.171.241.145'
        SSH_USER         = 'ubuntu'
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    set -e
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Installing Node.js if missing..."
                    if ! command -v node >/dev/null 2>&1; then
                        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
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
                    rm -rf dist
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
                    set -ex
                    echo "Deploying to frontend EC2..."

                    # Test SSH connection first
                    ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $SSH_USER@$FRONTEND_EC2_IP "echo Connection successful"

                    # Deploy files using rsync
                    rsync -avz -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no" --delete $BUILD_DIR/ $SSH_USER@$FRONTEND_EC2_IP:$DEPLOY_DIR/

                    # Restart web server
                    ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $SSH_USER@$FRONTEND_EC2_IP "sudo systemctl restart $WEB_SERVICE"
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed. Check the logs above for errors.'
        }
        always {
            cleanWs()
        }
    }
}
