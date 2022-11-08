FROM node:16-alpine

RUN mkdir /usr/app
COPY wait-for /usr/app

WORKDIR /usr/app

COPY components/ components
COPY consts/ consts
COPY pages/ pages
COPY public/ public
COPY styles/ styles

COPY package.json package-lock.json ./
COPY data.js next.config.js postcss.config.js tailwind.config.js ./

RUN chmod +x wait-for

RUN npm install -g npm@8
RUN npm install -g next

RUN npm install

