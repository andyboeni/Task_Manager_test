# Tech Stack — Task Manager

## Overview

Full-stack web application for CRUD task management.  
Backend: Java/Spring Boot · Frontend: React/TypeScript · Database: H2 (in-memory)

---

## Backend

| Concern | Choice | Notes |
|---|---|---|
| Language | Java 17 | LTS, required by Spring Boot 4 |
| Framework | Spring Boot 4.0.4 | Uses Jakarta EE 10 (jakarta.* imports, NOT javax.*) |
| Build tool | Maven | See `pom.xml` in project root |
| Web layer | Spring MVC (`spring-boot-starter-web`) | REST controllers |
| Persistence | Spring Data JPA (`spring-boot-starter-data-jpa`) | Repository pattern |
| Validation | Hibernate Validator (`spring-boot-starter-validation`) | Bean Validation 3.0 |
| Database | H2 in-memory (`com.h2database:h2`) | Console enabled in dev |
| Observability | Spring Actuator (`spring-boot-starter-actuator`) | `/actuator/health` exposed |
| Dev tooling | Spring DevTools (`spring-boot-devtools`, runtime/optional) | Hot reload |
| Testing | Spring Boot Test (`spring-boot-starter-test`) | JUnit 5 + Mockito |

### Corrected pom.xml dependencies

> ⚠️ The initial `pom.xml` contains several non-existent artifact IDs. Use **exactly** the following:

```xml
<dependencies>
    <!-- Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA + H2 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Actuator -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <!-- DevTools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>

    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Frontend

| Concern | Choice | Notes |
|---|---|---|
| Language | TypeScript | Strict mode enabled |
| Framework | React 18 | Functional components + hooks only |
| Build tool | Vite | `npm create vite@latest frontend -- --template react-ts` |
| Styling | TailwindCSS v3 | Utility-first, no component library needed |
| HTTP client | Axios | Typed API calls |
| Form handling | React Hook Form | Lightweight, integrates well with TS |
| State | React `useState` / `useEffect` | No Redux needed at this scale |

---

## Communication

- Protocol: HTTP/REST
- Format: JSON
- Backend port: `8080`
- Frontend dev port: `5173`
- CORS: allowed from `http://localhost:5173` (configured in Spring)

---

## Project layout

```
task-manager/
├── pom.xml                          # Maven backend build
├── src/
│   ├── main/
│   │   ├── java/org/imrofli/taskmanager/
│   │   │   ├── TaskManagerApplication.java
│   │   │   ├── config/          # CORS, etc.
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Request/Response DTOs
│   │   │   ├── entity/          # JPA entities
│   │   │   ├── exception/       # Global exception handler
│   │   │   ├── repository/      # Spring Data repos
│   │   │   └── service/         # Business logic
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql         # optional seed data
│   └── test/
│       └── java/org/imrofli/taskmanager/
│           ├── controller/      # MockMvc tests
│           └── service/         # Unit tests
└── frontend/                        # Vite React app
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/             # Axios API calls
        ├── components/      # Reusable UI pieces
        ├── pages/           # Page-level components
        ├── hooks/           # Custom hooks
        └── types/           # Shared TypeScript types
```
