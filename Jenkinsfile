pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                echo 'Cloning repository...'
                git branch: 'dev', credentialsId: 'github-credential', url: 'https://github.com/vuvuvuvvv/nextjs-verification-management.git'
            }
        }
        // stage('Check Docker') {
        //     steps {
        //         echo 'Checking Docker...'
        //         sh 'docker --version'
        //         sh 'ls -l /var/run/docker.sock'
        //         sh 'docker info'
        //     }
        // }
        stage('Build Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub-credential', toolName: '404Docker', url: '') {
                        sh 'docker build -t vuvuvuvvv/dhtverificationmanagement-nextjs:latest .'
                        sh 'docker push vuvuvuvvv/dhtverificationmanagement-nextjs:latest'
                    }
                }
            }
        }
    }
}