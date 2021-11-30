FROM alpine:latest

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=$BUILD_DATE \
    org.label-schema.description="Chrome running in headless mode in a tiny Alpine image" \
    org.label-schema.name="alpine-chrome" \
    org.label-schema.schema-version="1.0.0-rc1" \
    org.label-schema.usage="https://github.com/Zenika/alpine-chrome/blob/master/README.md" \
    org.label-schema.vcs-url="https://github.com/Zenika/alpine-chrome" \
    org.label-schema.vcs-ref=$VCS_REF \
    org.label-schema.vendor="Zenika" \
    org.label-schema.version="latest"

# Installs latest Chromium package.
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.12/main" >> /etc/apk/repositories \
    && apk upgrade -U -a \
    && apk add \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    font-noto-emoji \
    wqy-zenhei \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

COPY local.conf /etc/fonts/local.conf

# Add Chrome as a user
RUN mkdir -p /var/jenkins_home/workspace/demo \
    && adduser -D chrome \
    && chown -R chrome:chrome /var/jenkins_home/workspace/demo
# Run Chrome as non-privileged
USER chrome
WORKDIR /var/jenkins_home/workspace/demo

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Autorun chrome headless
ENTRYPOINT ["chromium-browser", "--headless", "--use-gl=swiftshader", "--disable-software-rasterizer", "--disable-dev-shm-usage"]


FROM node:latest

# update and add all the steps for running with xvfb
RUN apt-get update &&\
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps

# add the required dependencies
WORKDIR /var/jenkins_home/workspace/demo
COPY node_modules /var/jenkins_home/workspace/demo/node_modules
COPY extensions /var/jenkins_home/workspace/demo/extensions
RUN npm i puppeteer

# Finally copy the build application
COPY dist /var/jenkins_home/workspace/demo/dist

# make sure we can run without a UI
ENV DISPLAY :99
CMD Xvfb :99 -screen 0 1024x768x16 & npx codeceptjs run 