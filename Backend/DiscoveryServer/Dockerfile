FROM java:8
EXPOSE 8081
ADD /target/discoveryserver-0.0.1-SNAPSHOT.jar discoveryserver.jar
ENTRYPOINT ["java", "-jar", "discoveryserver.jar"]