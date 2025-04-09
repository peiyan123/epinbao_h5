pipeline {
  agent {
    node {
      label 'nodejs16'
    }
  }



    environment {
        REGISTRY = '192.168.87.183:8443'
        DOCKERHUB_NAMESPACE = 'epinbao'
        DOCKER_CREDENTIAL_ID = 'harbor'
        KUBECONFIG_CREDENTIAL_ID = 'kubeconfig'
        namespace = 'epinbao'
        service = 'epinbao-h5'
    }


    stages {


        stage ('checkout scm') {
            steps {
                checkout(scm)
            }
        }




        stage ('build & push') {
            steps {
                container ('nodejs16') {

                    sh 'yarn  install && yarn  build'

                    withCredentials([usernamePassword(passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,credentialsId : "$DOCKER_CREDENTIAL_ID" ,)]) {

                    sh "echo FROM nginx:alpine > Dockerfile"


                    sh "echo  COPY ./dist  /usr/share/nginx/html >> Dockerfile"

                    sh "cat Dockerfile"

                    sh 'echo "$DOCKER_PASSWORD" | docker login $REGISTRY -u "$DOCKER_USERNAME" --password-stdin'

                    sh 'docker build -f Dockerfile -t $REGISTRY/$DOCKERHUB_NAMESPACE/$service:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .'

                    sh 'docker push  $REGISTRY/$DOCKERHUB_NAMESPACE/$service:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER'
                    }

                }
            }
        }

        stage('deploy to dev') {
             steps {
                 container ('nodejs') {
                      withCredentials([
                          kubeconfigFile(
                          credentialsId: env.KUBECONFIG_CREDENTIAL_ID,
                          variable: 'KUBECONFIG')
                          ]) {
                          sh 'kubectl set image deployment/$service $service=$REGISTRY/$DOCKERHUB_NAMESPACE/$service:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER -n $namespace'
                      }
                 }
             }
        }


    }
}

