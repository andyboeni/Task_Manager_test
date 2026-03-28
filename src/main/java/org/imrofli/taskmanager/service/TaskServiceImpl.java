package org.imrofli.taskmanager.service;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.imrofli.taskmanager.dto.OnCreate;
import org.imrofli.taskmanager.dto.OnUpdate;
import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.exception.TaskNotFoundException;
import org.imrofli.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final Validator validator;

    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        this.validator = factory.getValidator();
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
        validateEntity(task, OnCreate.class);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task) {
        Task existingTask = taskRepository.findById(task.getId())
            .orElseThrow(() -> new TaskNotFoundException("Task not found"));
        
        validateEntity(task, OnUpdate.class);
        
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
        validateEntity(task, OnCreate.class);
    }

    @Override
    public void validateTaskBeforeUpdate(Task existingTask, Task updatedTask) {
        validateEntity(updatedTask, OnUpdate.class);
    }

    private void validateEntity(Object object, Class<?>... groups) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<Object>> violations = validator.validate(object, groups);
        
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException(violations.iterator().next().getMessage());
        }
    }
}
