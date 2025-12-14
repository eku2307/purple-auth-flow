
pipeline {
    agent any

    environment {
        // VITE env will be picked from .env.production automatically
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git url: 'https://github.com/eku2307/purple-auth-flow', branch: 'main'
            }
        }

        stage('Prepare Environment') {
            steps {
                sh '''
                    set -e
                    echo "Updating system packages..."
                    sudo apt-get update -y

                    echo "Checking Node.js version..."
                    node -v
                    npm -v
                '''
            }
        }

        stage('Clean Old Build & Cache') {
            steps {
                sh '''
                    echo "Removing old build and Vite cache..."
                    rm -rf dist
                    rm -rf node_modules/.vite
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
                    echo "Listing .env.production:"
                    ls -la .env.production

                    echo "VITE environment variables:"
                    env | grep VITE || echo "No VITE variables found"
                '''
            }
        }

        stage('Build Frontend for Production') {
            steps {
                sh '''
                    echo "Building frontend in production mode..."
                    # Use npx to ensure local Vite is used
                    npx vite build --mode production
                '''
            }
        }

        stage('Deploy to Frontend EC2') {
            steps {
                sshagent(['your-ssh-credentials-id']) {
                    sh '''
                        echo "Deploying to EC2..."
                        # Remove old files
                        ssh -o StrictHostKeyChecking=no ubuntu@YOUR_EC2_IP 'sudo rm -rf /var/www/html/*'
                        # Copy new build
                        scp -r dist/* ubuntu@YOUR_EC2_IP:/var/www/html/
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully'
        }
        failure {
            echo '❌ Deployment failed'
        }
        always {
            cleanWs()
        }
    }
}
