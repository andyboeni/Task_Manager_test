# API Specification — Task Manager

Base URL: `http://localhost:8080/api/tasks`

---

## Data Model

### TaskStatus (enum)
```
TODO | IN_PROGRESS | DONE
```

### Task (response object)
```json
{
  "id": 1,
  "title": "Write unit tests",
  "description": "Cover service layer with Mockito",
  "status": "IN_PROGRESS",
  "dueDate": "2026-03-28"
}
```

### TaskRequest (request body)
```json
{
  "title": "Write unit tests",
  "description": "Cover service layer with Mockito",
  "status": "TODO",
  "dueDate": "2026-03-28"
}
```
- `title`: **required**, string, max 100 chars
- `description`: optional, string, max 500 chars
- `status`: **required**, one of `TODO | IN_PROGRESS | DONE`
- `dueDate`: optional, ISO 8601 date (`YYYY-MM-DD`)

### ErrorResponse
```json
{
  "message": "Task not found with id: 99"
}
```

### ValidationErrorResponse
```json
{
  "message": "Validation failed",
  "errors": {
    "title": "must not be blank",
    "status": "must not be null"
  }
}
```

---

## Endpoints

### GET /api/tasks
Retrieve all tasks.

**Response** `200 OK`
```json
[
  { "id": 1, "title": "...", "status": "TODO", "dueDate": null, "description": null },
  { "id": 2, "title": "...", "status": "DONE", "dueDate": "2026-03-20", "description": "..." }
]
```

---

### GET /api/tasks/{id}
Retrieve a single task by ID.

**Path param:** `id` — long

**Response** `200 OK` → Task object  
**Response** `404 Not Found` → ErrorResponse

---

### POST /api/tasks
Create a new task.

**Request body:** TaskRequest (validated)

**Response** `201 Created` → Task object  
**Response** `400 Bad Request` → ValidationErrorResponse

---

### PUT /api/tasks/{id}
Update an existing task (full replacement).

**Path param:** `id` — long  
**Request body:** TaskRequest (validated)

**Response** `200 OK` → updated Task object  
**Response** `400 Bad Request` → ValidationErrorResponse  
**Response** `404 Not Found` → ErrorResponse

---

### DELETE /api/tasks/{id}
Delete a task by ID.

**Path param:** `id` — long

**Response** `204 No Content`  
**Response** `404 Not Found` → ErrorResponse

---

## HTTP status code summary

| Code | Meaning |
|---|---|
| 200 | Success (GET, PUT) |
| 201 | Created (POST) |
| 204 | Deleted (DELETE) |
| 400 | Validation error |
| 404 | Task not found |
| 500 | Unexpected server error |

---

## CORS

Allowed origins: `http://localhost:5173`  
Allowed methods: `GET, POST, PUT, DELETE, OPTIONS`  
Configured via `WebConfig.java` — see GUIDELINES.md.
