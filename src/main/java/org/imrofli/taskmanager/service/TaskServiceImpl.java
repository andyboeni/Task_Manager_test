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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public List<Task> getTasksWithPagination(int pageNumber, int pageSize, String searchTerm, String sortBy, String orderBy) {
        Pageable pageable = getPageable(pageNumber, pageSize, sortBy, orderBy);
        
        if (searchTerm == null || searchTerm.isEmpty()) {
            return taskRepository.findAll(pageable).getContent();
        }
        
        return taskRepository.findByTitleContainingOrDescriptionContaining(searchTerm.toLowerCase(), pageable);
    }

    @Override
    public Long countTasks(String searchTerm) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return taskRepository.count();
        }
        return taskRepository.countByTitleContainingOrDescriptionContaining(searchTerm.toLowerCase());
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

    private Pageable getPageable(int pageNumber, int pageSize, String sortBy, String orderBy) {
        Sort.Direction direction = orderBy != null && orderBy.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        return PageRequest.of(pageNumber, pageSize, getSort(sortBy, direction));
    }

    private Sort getSort(String sortBy, Sort.Direction direction) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by(direction, "id");
        }
        
        switch (sortBy.toLowerCase()) {
            case "title": return Sort.by(direction, "title");
            case "status": return Sort.by(direction, "status");
            case "priority": return Sort.by(direction, "priority");
            default: return Sort.by(direction, "id");
        }
    }
}
