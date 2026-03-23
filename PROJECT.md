# Project Overview — Task Manager

Agentic SDLC exercise (Accenture, 2026).  
Build a full-stack CRUD task management app with a Java/Spring Boot backend and a React/TypeScript frontend.

---

## Key documents

| File | Purpose |
|---|---|
| `TECHSTACK.md` | All technology choices, corrected `pom.xml` deps, folder layout |
| `GUIDELINES.md` | Coding conventions, patterns, do's and don'ts for every layer |
| `API_SPEC.md` | Full REST contract: endpoints, payloads, status codes |
| `PROJECT.md` | This file — task list and acceptance criteria |

---

## Build order for AI agents

Work through these tasks **in order**. Do not start a task until the previous one compiles/passes.

### Phase 1 — Backend scaffold

- [ ] Fix `pom.xml` using the corrected dependency list in `TECHSTACK.md`
- [ ] Create `TaskStatus` enum in `.entity` package
- [ ] Create `Task` JPA entity
- [ ] Create `TaskRequest` and `TaskResponse` records in `.dto`
- [ ] Create `TaskRepository` extending `JpaRepository<Task, Long>`
- [ ] Create `TaskService` interface + `TaskServiceImpl`
- [ ] Create `TaskNotFoundException` in `.exception`
- [ ] Create `GlobalExceptionHandler` in `.exception`
- [ ] Create `TaskController` with all 5 endpoints
- [ ] Create `WebConfig` for CORS
- [ ] Add `application.properties` (H2 in-memory, JPA settings)
- [ ] Verify: `mvn spring-boot:run` starts without errors

### Phase 2 — Backend tests

- [ ] `TaskServiceImplTest` — unit tests (Mockito) for create, read, update, delete, not-found
- [ ] `TaskControllerTest` — `@WebMvcTest` for all 5 endpoints including validation errors
- [ ] Verify: `mvn test` passes

### Phase 3 — Frontend scaffold

- [ ] `npm create vite@latest frontend -- --template react-ts` inside project root
- [ ] Install dependencies: `axios`, `react-hook-form`, `tailwindcss` (+ postcss, autoprefixer)
- [ ] Configure Tailwind (`tailwind.config.ts`, `index.css`)
- [ ] Add Vite proxy in `vite.config.ts` (`/api` → `http://localhost:8080`)
- [ ] Define `Task`, `TaskStatus`, `TaskFormData` types in `src/types/task.ts`
- [ ] Create `src/api/taskApi.ts` with all 5 API functions

### Phase 4 — Frontend features

- [ ] `TaskList` component — fetches and displays all tasks on load
- [ ] `TaskCard` component — shows title, description, status badge, due date, Edit/Delete buttons
- [ ] `TaskForm` component — React Hook Form, used for both create and edit, all validations
- [ ] `StatusBadge` component — colour-coded pill for `TODO` / `IN_PROGRESS` / `DONE`
- [ ] `ErrorMessage` component — displays API error text
- [ ] `App.tsx` — wires everything together; modal or inline form for add/edit
- [ ] Delete confirmation (simple `window.confirm` is fine)
- [ ] Status change via dropdown inside `TaskCard` or `TaskForm`
- [ ] Verify: `npm run dev` loads, all CRUD flows work end-to-end

### Phase 5 — Optional / bonus

- [ ] Sort tasks by status or due date (frontend only)
- [ ] Search/filter bar (frontend only)
- [ ] Add `category` field to entity, DTO, form, and display

---

## Acceptance criteria (from task brief)

- App starts and all 5 REST endpoints respond correctly
- Creating a task with a blank title returns `400` with a useful message
- Updating a non-existent task returns `404`
- Frontend lists all tasks on load
- Frontend form validates required fields and character limits before submit
- Frontend displays a readable error when the API call fails
- All backend unit and integration tests pass (`mvn test`)
- Code follows conventions in `GUIDELINES.md`

---

## Running the project locally

```bash
# Backend
mvn spring-boot:run
# → http://localhost:8080
# → H2 console: http://localhost:8080/h2-console

# Frontend (in /frontend)
npm install
npm run dev
# → http://localhost:5173
```
