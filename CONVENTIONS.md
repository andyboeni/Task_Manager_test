# CONVENTIONS.md
# Aider reads this file to understand the project's coding standards.
# Follow these rules in every file you generate or modify.

---

## Project

**Task Manager** — Spring Boot 4 backend + React 18 / TypeScript frontend.
Base Java package: `org.imrofli.taskmanager`

---

## CRITICAL: Jakarta, not javax

This project uses **Spring Boot 4 / Jakarta EE 10**.
ALL imports must use `jakarta.*` — never `javax.*`.

```java
// CORRECT
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;

// WRONG — will not compile
import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;
```

---

## Backend — Java

### No Lombok

Write explicit getters, setters, and constructors.
Use Java **records** for DTOs (they are immutable and concise).

```java
// DTO — use records
public record TaskRequest(
    @NotBlank @Size(max = 100) String title,
    @Size(max = 500)            String description,
    @NotNull                    TaskStatus status,
                                LocalDate dueDate
) {}

// Entity — use plain class with explicit accessors
public class Task {
    private Long id;
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
```

### Layered architecture — strict separation

| Layer | Package | Rule |
|---|---|---|
| Controller | `.controller` | HTTP only — no business logic |
| Service | `.service` | All logic lives here |
| Repository | `.repository` | Spring Data only — no raw SQL |
| Entity | `.entity` | JPA mappings only |
| DTO | `.dto` | Records for request/response |
| Exception | `.exception` | Custom exceptions + GlobalExceptionHandler |
| Config | `.config` | Beans, CORS, etc. |

### Naming

- Classes: `PascalCase`
- Methods / variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Controllers: suffix `Controller`
- Services: suffix `Service` / `ServiceImpl`
- DTOs: suffix `Request` or `Response`
- Exceptions: suffix `Exception`

### REST controllers

Always return `ResponseEntity<T>`. Always use `@Valid` on request bodies.
Never put logic in a controller — call the service.

```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }
}
```

### Services

- Interface + `@Service` implementation
- Read methods: `@Transactional(readOnly = true)`
- Write methods: `@Transactional`
- Throw `TaskNotFoundException` (extends `RuntimeException`) when entity is missing

### Exception handling

One `@RestControllerAdvice` class handles everything:
- `TaskNotFoundException` → 404
- `MethodArgumentNotValidException` → 400 with field errors
- `Exception` → 500 fallback

### Logging

Use SLF4J. Never use `System.out.println`.

```java
private static final Logger log = LoggerFactory.getLogger(TaskService.class);
log.info("Creating task: {}", request.title());
```

### CORS

Configured once in `WebConfig.java` via `WebMvcConfigurer`.
Never use `@CrossOrigin` on individual controllers.

---

## Backend — Tests

- Unit tests: `@ExtendWith(MockitoExtension.class)` for service layer
- Integration tests: `@WebMvcTest` + `MockMvc` for controllers
- Method naming: `methodName_scenario_expectedBehaviour()`
- One test class per production class

---

## Frontend — TypeScript / React

### Strict TypeScript

`strict: true` in `tsconfig.json`. No `any`, no `@ts-ignore`.

### Shared types

All shared types live in `src/types/task.ts`:

```ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string; // ISO date string YYYY-MM-DD
}

export type TaskFormData = Omit<Task, 'id'>;
```

### API layer

All HTTP calls go through `src/api/taskApi.ts`.
Never call `axios` or `fetch` directly inside a component.

```ts
export const getAllTasks  = ()                               => axios.get<Task[]>('/api/tasks');
export const createTask   = (data: TaskFormData)             => axios.post<Task>('/api/tasks', data);
export const updateTask   = (id: number, d: TaskFormData)    => axios.put<Task>(`/api/tasks/${id}`, d);
export const deleteTask   = (id: number)                     => axios.delete(`/api/tasks/${id}`);
```

### Components

- Functional components only — no class components
- One component per file, filename matches component name (`PascalCase.tsx`)
- Props interface defined in the same file as the component
- Reusable pieces → `src/components/`
- Page-level components → `src/pages/`
- Custom hooks → `src/hooks/`

### Forms

Use **React Hook Form** for all forms. Validation rules must match backend constraints:
- `title`: required, maxLength 100
- `description`: optional, maxLength 500
- `status`: required, one of the three enum values
- `dueDate`: optional

### Error handling

Wrap every API call in try/catch. Display errors via a shared `ErrorMessage` component.
Never use `console.error` as the sole error handler.

### Styling

Tailwind utility classes only. No inline `style={{}}`. No custom CSS files except `index.css`.

---

## API contract

Base URL: `/api/tasks`

| Method | Path | Success |
|---|---|---|
| GET | `/api/tasks` | 200 |
| GET | `/api/tasks/{id}` | 200 / 404 |
| POST | `/api/tasks` | 201 / 400 |
| PUT | `/api/tasks/{id}` | 200 / 400 / 404 |
| DELETE | `/api/tasks/{id}` | 204 / 404 |

Task entity fields: `id` (auto), `title` (required, max 100), `description` (optional, max 500),
`status` (enum: TODO / IN_PROGRESS / DONE), `dueDate` (optional, ISO date).

---

## Git

Commit format: `type(scope): short description`
Types: `feat` `fix` `refactor` `test` `docs` `chore`
Example: `feat(backend): add DELETE /api/tasks/{id} endpoint`

---

## Hard rules for the AI

- Always use `jakarta.*` — never `javax.*`
- Never add a dependency not in `TECHSTACK.md` without flagging it first
- Never put SQL in a service or controller — use Spring Data JPA
- Never skip `@Valid` on a request body
- Never hardcode ports — use `application.properties`
- Never use `System.out.println` — use SLF4J
- Never use `@CrossOrigin` on controllers
- If a diff fails to apply cleanly, output the whole file instead
