FROM java:8
EXPOSE 8761
ADD /target/backendservice-0.0.1-SNAPSHOT.jar backend.jar
ENTRYPOINT ["java", "-jar", "backend.jar"]