FROM node:latest

# Fix certificate issues
RUN apt-get update --no-install-recommends && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

COPY codecept.conf.js /var/jenkins_home/workspace/Codecept/
COPY package.json /var/jenkins_home/workspace/Codecept/
COPY test /var/jenkins_home/workspace/Codecept/tests
COPY load-tests /var/jenkins_home/workspace/Codecept/load-tests
COPY docker/run-tests.sh /var/jenkins_home/workspace/Codecept/docker/

WORKDIR /var/jenkins_home/workspace/Codecept
RUN npm install

ONBUILD ADD . /var/jenkins_home/workspace/Codecept
ONBUILD WORKDIR /var/jenkins_home/workspace/Codecept
ONBUILD RUN npm install

CMD ["/app/docker/run-tests.sh"]