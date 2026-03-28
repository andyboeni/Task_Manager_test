package org.imrofli.taskmanager.service;

import jakarta.transaction.Transactional;
import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.exception.TaskNotFoundException;
import org.imrofli.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Task createTask(Task task) {
        validateTaskBeforeCreate(task);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        Task existingTask = taskRepository.findById(task.getId())
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));
        
        if (!task.getTitle().equals(existingTask.getTitle())) {
            validateTaskBeforeUpdate(existingTask, task);
        }
        
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    @Override
    public void validateTaskBeforeCreate(Task task) {
        if (task.getTitle() == null || task.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title must not be empty");
        }
        
        if (task.getTitle().length() > 100) {
            throw new IllegalArgumentException("Title exceeds maximum length of 100 characters");
        }
        
        if (task.getDescription() != null && task.getDescription().length() > 500) {
            throw new IllegalArgumentException("Description exceeds maximum length of 500 characters");
        }
    }

    @Override
    public void validateTaskBeforeUpdate(Task existingTask, Task updatedTask) {
        if (updatedTask.getTitle() == null || updatedTask.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title must not be empty");
        }
        
        if (updatedTask.getTitle().length() > 100) {
            throw new IllegalArgumentException("Title exceeds maximum length of 100 characters");
        }
        
        if (updatedTask.getDescription() != null && updatedTask.getDescription().length() > 500) {
            throw new IllegalArgumentException("Description exceeds maximum length of 500 characters");
        }
    }
}
