pipeline {
    agent any

    environment {
        DEPLOY_DIR   = '/var/www/html'
        BUILD_DIR    = 'dist'
        NODE_VERSION = '20'
        VITE_API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net'
        FRONTEND_EC2 = 'ubuntu@16.171.241.145'
        SSH_KEY      = '/var/lib/jenkins/.ssh/novapay_key_pair.pem'
        NODE_ENV     = 'production' // Force production environment
    }

    stages {

        stage('Prepare Environment') {
            steps {
                sh '''
                    set -e
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Installing Node.js..."
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
                    echo "Cleaning old build and cache..."
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

        stage('Build Project for Production') {
            steps {
                sh '''
                    echo "Building frontend with production mode..."
                    npm run build -- --mode production
                '''
            }
        }

        stage('Verify Build') {
            steps {
                sh '''
                    echo "Checking if API URL is correct in build files..."
                    grep "$VITE_API_BASE_URL" dist/assets/*.js || echo "Warning: URL not found in build!"
                '''
            }
        }

        stage('Deploy to Frontend EC2') {
            steps {
                sh '''
                    echo "Deploying to frontend EC2..."

                    # Sync files to frontend EC2
                    rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" $BUILD_DIR/ $FRONTEND_EC2:$DEPLOY_DIR/

                    # Restart Nginx on frontend
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no $FRONTEND_EC2 "sudo systemctl restart nginx"
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


