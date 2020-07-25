FROM selenium/standalone-chrome:84.0
LABEL MAINTAINER="Andriy Malyshenko <andrey.malyshenko@gmail.com>"

USER root

RUN apt-get update &&  apt-get install -y \
 	software-properties-common apt-utils && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
	apt-get -y install nodejs && \
	rm -rf /var/lib/apt/lists/*

RUN  mkdir /app
ADD . /app
WORKDIR /app
RUN npm install

ENV APP_CHROME_HEADLESS true 
ENV APP_MYSQL_CRED_PATH "/app/.secret/mysql"
ENV APP_ING_CRED_PATH "/app/.secret/inglogin"

ENTRYPOINT [ "npm", "run", "start" ]
