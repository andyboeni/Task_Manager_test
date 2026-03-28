package org.imrofli.taskmanager.controller;

import jakarta.validation.Valid;
import org.imrofli.taskmanager.dto.TaskResponse;
import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.exception.TaskNotFoundException;
import org.imrofli.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks.stream()
            .map(this::toTaskResponse)
            .toList());
    }

    private TaskResponse toTaskResponse(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getDueDate()
        );
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        try {
            Optional<Task> task = taskService.getTaskById(id);
            if (task.isPresent()) {
                return ResponseEntity.ok(toTaskResponse(task.get()));
            }
            return ResponseEntity.notFound().build();
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());
        task.setDueDate(request.dueDate());

        Task createdTask = taskService.createTask(task);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(toTaskResponse(createdTask));
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        try {
            Task existingTask = taskService.getTaskById(id).orElseThrow();
            
            existingTask.setTitle(request.title());
            existingTask.setDescription(request.description());
            existingTask.setStatus(request.status());
            existingTask.setDueDate(request.dueDate());

            Task updatedTask = taskService.updateTask(existingTask);
            
            return ResponseEntity.ok(toTaskResponse(updatedTask));
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TaskResponse> patchTask(@PathVariable Long id, @Valid @RequestBody TaskPatchRequest request) {
        try {
            Task existingTask = taskService.getTaskById(id).orElseThrow();
            
            if (request.title() != null && !request.title().isEmpty()) {
                existingTask.setTitle(request.title());
            }
            if (request.description() != null) {
                existingTask.setDescription(request.description());
            }
            if (request.status() != null) {
                existingTask.setStatus(request.status());
            }
            if (request.dueDate() != null) {
                existingTask.setDueDate(request.dueDate());
            }

            Task updatedTask = taskService.updateTask(existingTask);
            
            return ResponseEntity.ok(toTaskResponse(updatedTask));
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
