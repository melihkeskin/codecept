FROM node:latest

COPY codecept.conf.js /var/jenkins_home/workspace/codecept/
COPY package.json /var/jenkins_home/workspace/codecept/
COPY test /var/jenkins_home/workspace/codecept/tests
COPY load-tests /var/jenkins_home/workspace/codecept/load-tests
COPY docker/run-tests.sh /var/jenkins_home/workspace/codecept/docker/

WORKDIR /var/jenkins_home/workspace/codecept
RUN npm install -y

ONBUILD ADD . /var/jenkins_home/workspace/codecept
ONBUILD WORKDIR /var/jenkins_home/workspace/codecept
ONBUILD RUN npm install -y 

CMD ["/var/jenkins_home/workspace/codecept/docker/run-tests.sh"]