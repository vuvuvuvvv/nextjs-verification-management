pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repository...'
                git branch: 'dev', credentialsId: 'github-credential', url: 'https://github.com/vuvuvuvvv/nextjs-verification-management.git'
            }
        }
        stage('Check Docker') {
            steps {
                echo 'Checking Docker...'
                sh 'docker --version'
                sh 'ls -l /var/run/docker.sock'
                sh 'docker info'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub-credential', toolName: '404Docker', url: 'https://index.docker.io/v1/') {
                        sh 'docker build -t vuvuvuvvv/dhtverificationmanagement-nextjs:latest .'
                        sh 'docker push vuvuvuvvv/dhtverificationmanagement-nextjs:latest'
                    }
                }
            }
        }
    }

    post {
        success {
            mail bcc: '', 
                body: "Build Webserver successfully.\n\n" +
                    "Detail: ${env.BUILD_URL}",
                cc: '', 
                from: '', 
                replyTo: '', 
                subject: "Jenkins Build Report: ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                to: 'nguyenvu260502@gmail.com'
        }
        failure {
            mail bcc: '', 
                body: "Build Webserver failed.\n\n" +
                    "Detail: ${env.BUILD_URL}",
                cc: '', 
                from: '', 
                replyTo: '', 
                subject: "Jenkins Build Report: ${env.JOB_NAME} #${env.BUILD_NUMBER}", 
                to: 'nguyenvu260502@gmail.com'
        }
    }
}