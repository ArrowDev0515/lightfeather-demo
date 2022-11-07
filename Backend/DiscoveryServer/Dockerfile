FROM openjdk:8-alpine

RUN mkdir /usr/app
COPY wait-for /usr/app

WORKDIR /usr/app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x wait-for

RUN ./mvnw dependency:resolve

COPY src ./src

