FROM node:latest

# install libraries
RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
# tools
RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils
# and fonts
RUN apt-get install -yyq fonts-liberation

COPY codecept.conf.js /var/jenkins_home/workspace/codecept/
COPY package.json /var/jenkins_home/workspace/codecept/ 
COPY no_test /var/jenkins_home/workspace/codecept/no_test
COPY docker/run-tests.sh /var/jenkins_home/workspace/codecept/docker/

WORKDIR /var/jenkins_home/workspace/codecept
RUN npm install -y

ONBUILD ADD . /var/jenkins_home/workspace/codecept
ONBUILD WORKDIR /var/jenkins_home/workspace/codecept
 
ONBUILD RUN npm install -y
 
CMD ["/var/jenkins_home/workspace/codecept/docker/run-tests.sh"]

ONBUILD RUN npx codeceptjs run --steps
