FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el archivo POM y descargar dependencias
COPY pom.xml .
RUN mkdir -p src/main/java
RUN mkdir -p src/main/resources
RUN mvn dependency:go-offline

# Copiar el código fuente y compilar
COPY src/ src/
RUN mvn package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]