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

        stage('Clean Old Build & Cache') {
    steps {
        sh '''
            echo "Removing old build artifacts..."
            rm -rf dist

            echo "Removing Vite cache..."
            rm -rf node_modules/.vite
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
            echo "---- ENV FILES ----"
            ls -la .env* || true

            echo "---- VITE VARIABLES ----"
            printenv | grep VITE || true
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
            echo "Deploying build to Frontend EC2 (16.171.241.145)..."

            rsync -avz --delete \
                dist/ \
                ubuntu@16.171.241.145:/var/www/html/

            echo "Restarting nginx on frontend EC2..."
            ssh ubuntu@16.171.241.145 "sudo systemctl restart nginx"
        '''
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
