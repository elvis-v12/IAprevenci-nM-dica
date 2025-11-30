# Build stage
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# Copia del POM y wrapper (cache de dependencias)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
RUN mvn -B -ntp dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn -B -ntp clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Crear usuario no-root
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Activar profile docker
ENV SPRING_PROFILES_ACTIVE=docker

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
