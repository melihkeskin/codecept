FROM node:latest

# Fix certificate issues
RUN apt-get update --no-install-recommends && \
    apt-get install ca-certificates-java && \
    apt-get clean && \
    update-ca-certificates -f;

COPY codecept.conf.js /var/jenkins_home/workspace/codecept/
COPY package.json /var/jenkins_home/workspace/codecept/
COPY test /var/jenkins_home/workspace/codecept/tests
COPY load-tests /var/jenkins_home/workspace/codecept/load-tests
COPY docker/run-tests.sh /var/jenkins_home/workspace/codecept/docker/

WORKDIR /var/jenkins_home/workspace/codecept
RUN npm install

ONBUILD ADD . /var/jenkins_home/workspace/codecept
ONBUILD WORKDIR /var/jenkins_home/workspace/codecept
ONBUILD RUN npm install

CMD ["/app/docker/run-tests.sh"]