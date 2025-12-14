pipeline {
    agent any

    environment {
        DEPLOY_DIR   = '/var/www/html'
        BUILD_DIR    = 'dist'
        NODE_VERSION = '20'
        FRONTEND_EC2 = 'ubuntu@16.171.241.145'
        SSH_KEY      = '/var/lib/jenkins/.ssh/novapay_key_pair.pem'
        NODE_ENV     = 'production'
        VITE_API_BASE_URL = 'https://d1sj9f5n6y3ndx.cloudfront.net' // Ensure .env.production uses this
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
                    echo "Removing old build and Vite cache..."
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

        stage('Debug Env Files') {
            steps {
                sh '''
                    echo "Listing environment files:"
                    ls -la .env* || true

                    echo "Current VITE environment variables:"
                    env | grep VITE || true
                '''
            }
        }

        stage('Build Frontend for Production') {
            steps {
                sh '''
                    echo "Building frontend in production mode..."
                    npm run build -- --mode production
                '''
            }
        }

        stage('Verify API URL in Build') {
            steps {
                sh '''
                    echo "Checking built JS files for correct API URL..."
                    if grep -q "$VITE_API_BASE_URL" dist/assets/*.js; then
                        echo "✅ Correct API URL found in build files"
                    else
                        echo "❌ ERROR: Correct API URL not found! Build may be using api.example.com"
                        exit 1
                    fi
                '''
            }
        }

        stage('Deploy to Frontend EC2') {
            steps {
                sh '''
                    echo "Deploying to EC2..."

                    # Sync files to frontend EC2 and remove old files
                    rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" $BUILD_DIR/ $FRONTEND_EC2:$DEPLOY_DIR/

                    # Restart Nginx
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no $FRONTEND_EC2 "sudo systemctl restart nginx"
                '''
            }
        }

    }

    post {
        success {
            echo '✅ Frontend deployment completed successfully'
        }
        failure {
            echo '❌ Deployment failed'
        }
        always {
            cleanWs()
        }
    }
}
