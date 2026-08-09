# ArenaLink - Backend

ArenaLink is a comprehensive esports tournament and team management platform. This repository contains the Spring Boot backend service that powers the ArenaLink platform.

## 🚀 Technologies Used
- **Java 21**
- **Spring Boot 3.x**
- **Spring Security & JWT** (Role-based authentication)
- **Spring Data JPA & Hibernate**
- **MySQL Database**
- **Swagger / OpenAPI** for API Documentation
- **Lombok**
- **Maven**

## ✨ Core Features
- **Identity & Access Management:** JWT-based authentication supporting three distinct roles: `PLAYER`, `ORGANIZER`, and `ADMIN`.
- **Player Profiles:** Detailed player profiles with in-game names (IGN), region, rank, and age tracking.
- **Team Management:** Create teams, manage members (Captains and Members), handle team join requests, and view team details.
- **Tournament Engine:** Organizers can host tournaments for different games, configure prize pools, team limits, and deadlines.
- **Bracket & Match System:** Automated generation of brackets, match scheduling, score updates, and winner progression.
- **Data Seeding:** Built-in massive data injector for testing with thousands of dummy records on startup.

## 🛠️ Prerequisites
- JDK 21+
- Maven
- MySQL Server 8.x

## ⚙️ Setup Instructions
1. **Configure the Database:**
   Ensure your MySQL server is running. Create the database named `arenalinkdb` or allow Hibernate to create it.
   Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/arenalinkdb?createDatabaseIfNotExist=true&useSSL=false
   spring.datasource.username=root
   spring.datasource.password=YourMySQLPassword
   ```
2. **Build the Project:**
   ```bash
   mvn clean install
   ```
3. **Run the Application:**
   ```bash
   mvn spring-boot:run
   ```
   *Note: On initial startup, the application's DataSeeder will inject dummy data into the database for testing.*

## 📚 API Documentation
Once the server is running, the interactive Swagger API documentation can be accessed at:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON:** `http://localhost:8080/v3/api-docs`

## 👥 Authentication
The API is secured using JWT. To access protected endpoints, you must:
1. Register/Login via the `/auth` endpoints.
2. Extract the `token` from the response.
3. Pass it in the Authorization header: `Authorization: Bearer <your_jwt_token>`
