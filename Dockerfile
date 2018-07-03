FROM node:8.11

RUN mkdir -p /usr/app/src
WORKDIR /usr/app/src
COPY . /usr/app/src

RUN npm install 
