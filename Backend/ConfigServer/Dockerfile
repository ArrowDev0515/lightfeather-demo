FROM java:8
EXPOSE 8082
ADD /target/configserver-0.0.1-SNAPSHOT.jar configserver.jar
ENTRYPOINT ["java", "-jar", "configserver.jar"]