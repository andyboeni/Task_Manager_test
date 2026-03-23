# Coding Guidelines — Task Manager

These rules apply to every file generated or modified in this project.  
AI agents MUST follow them without deviation unless explicitly instructed otherwise.

---

## General

- Never use `javax.*` imports — this project uses **Jakarta EE 10** (`jakarta.*`)
- No Lombok — write explicit getters, setters, constructors, or use Java records for DTOs
- No global mutable state
- All public methods must have a clear single responsibility
- Prefer composition over inheritance

---

## Backend (Java / Spring Boot)

### Package structure

Base package: `org.imrofli.taskmanager`

| Layer | Package | Responsibility |
|---|---|---|
| Entry point | (base) | `TaskManagerApplication.java` only |
| Config | `.config` | Beans, CORS, etc. |
| Controller | `.controller` | HTTP in/out, no business logic |
| DTO | `.dto` | `TaskRequest`, `TaskResponse` records |
| Entity | `.entity` | JPA-mapped classes |
| Repository | `.repository` | `JpaRepository` extensions |
| Service | `.service` | Business logic, transactional |
| Exception | `.exception` | `GlobalExceptionHandler`, custom exceptions |

### Naming

- Classes: `PascalCase`
- Methods/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- REST controllers: suffix `Controller` (e.g. `TaskController`)
- Services: suffix `Service` / `ServiceImpl`
- DTOs: suffix `Request` or `Response`

### Entity rules

```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @Size(max = 500)
    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;  // TODO | IN_PROGRESS | DONE

    private LocalDate dueDate;
    // explicit getters/setters — no Lombok
}
```

### DTO rules

Use Java **records** for DTOs:

```java
// Request
public record TaskRequest(
    @NotBlank @Size(max = 100) String title,
    @Size(max = 500)            String description,
    @NotNull                    TaskStatus status,
                                LocalDate dueDate
) {}

// Response
public record TaskResponse(
    Long id, String title, String description,
    TaskStatus status, LocalDate dueDate
) {}
```

### Controller rules

- Annotate with `@RestController` + `@RequestMapping("/api/tasks")`
- Return `ResponseEntity<T>` for all endpoints
- Never put business logic in controllers — delegate to service
- Validate request body with `@Valid`

```java
@PostMapping
public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest req) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
}
```

### Service rules

- Interface + `@Service` implementation
- Mark read methods `@Transactional(readOnly = true)`
- Mark write methods `@Transactional`
- Throw a custom `TaskNotFoundException` (extends `RuntimeException`) when an entity is not found

### Exception handling

Create a `GlobalExceptionHandler` with `@RestControllerAdvice`:

```java
@ExceptionHandler(TaskNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNotFound(TaskNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ErrorResponse(ex.getMessage()));
}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    // collect field errors and return 400
}
```

### CORS configuration

Configure via a `WebMvcConfigurer` bean, not via `@CrossOrigin` on individual controllers:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET","POST","PUT","DELETE","OPTIONS");
    }
}
```

### application.properties

```properties
# H2
spring.datasource.url=jdbc:h2:mem:taskdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 console (dev only)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Actuator
management.endpoints.web.exposure.include=health,info
```

### Testing

- Unit tests for `Service` layer using Mockito (`@ExtendWith(MockitoExtension.class)`)
- Integration tests for `Controller` layer using `@WebMvcTest` + `MockMvc`
- One test class per production class
- Test method naming: `methodName_scenario_expectedBehaviour()`

---

## Frontend (React / TypeScript)

### TypeScript

- `strict: true` in `tsconfig.json` — no `any`, no `@ts-ignore`
- Define all shared types in `src/types/task.ts`:

```ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;  // ISO date string
}

export type TaskFormData = Omit<Task, 'id'>;
```

### Component rules

- Functional components only, no class components
- One component per file, filename matches component name (`PascalCase.tsx`)
- Extract reusable pieces to `src/components/`
- Page-level components live in `src/pages/`
- Props interfaces defined in the same file as the component

### API layer

All backend calls go through `src/api/taskApi.ts` — no `fetch`/`axios` calls in components:

```ts
import axios from 'axios';
import { Task, TaskFormData } from '../types/task';

const BASE = 'http://localhost:8080/api/tasks';

export const getAllTasks  = ()                        => axios.get<Task[]>(BASE);
export const getTask      = (id: number)              => axios.get<Task>(`${BASE}/${id}`);
export const createTask   = (data: TaskFormData)      => axios.post<Task>(BASE, data);
export const updateTask   = (id: number, data: TaskFormData) => axios.put<Task>(`${BASE}/${id}`, data);
export const deleteTask   = (id: number)              => axios.delete(`${BASE}/${id}`);
```

### Error handling

- Wrap all API calls in try/catch
- Display user-facing error messages via a dedicated `ErrorMessage` component
- Never `console.error` as the sole error handler in production code

### Form validation

Use **React Hook Form** with inline validation rules matching backend constraints:
- `title`: required, maxLength 100
- `description`: optional, maxLength 500
- `status`: required, one of the three enum values
- `dueDate`: optional, valid date

### Styling (Tailwind)

- No inline `style={{}}` — use Tailwind utility classes
- No custom CSS files except `index.css` for base Tailwind directives
- Responsive by default: use `sm:`, `md:` breakpoints

### Vite proxy (dev)

Add to `vite.config.ts` to avoid CORS issues during local development:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

With this proxy active, update `taskApi.ts` base URL to `/api/tasks`.

---

## Git

- One logical change per commit
- Commit message format: `type(scope): short description`  
  Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Example: `feat(backend): add DELETE /api/tasks/{id} endpoint`

---

## What AI agents must NOT do

- Do not add dependencies not listed in TECHSTACK.md without noting it
- Do not use `javax.*` — always `jakarta.*`
- Do not put SQL in controller or service — use Spring Data JPA
- Do not skip `@Valid` on request bodies
- Do not hardcode port numbers outside of config files
- Do not use `System.out.println` — use SLF4J (`private static final Logger log = ...`)
