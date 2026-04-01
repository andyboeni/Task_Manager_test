package org.imrofli.taskmanager.service;

import org.imrofli.taskmanager.entity.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public interface TaskService {
    
    @Transactional(readOnly = true)
    List<Task> getAllTasks();

    @Transactional(readOnly = true)
    Optional<Task> getTaskById(Long id);

    @Transactional
    Task createTask(Task task);

    @Transactional
    Task updateTask(Task task);

    @Transactional
    void deleteTask(Long id);

    void validateTaskBeforeCreate(Task task);

    void validateTaskBeforeUpdate(Task existingTask, Task updatedTask);

    List<Task> getTasksWithPagination(int pageNumber, int pageSize, String searchTerm, String sortBy, String orderBy);

    Long countTasks(String searchTerm);
}
