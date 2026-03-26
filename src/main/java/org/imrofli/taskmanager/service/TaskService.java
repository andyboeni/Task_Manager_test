package org.imrofli.taskmanager.service;

import jakarta.transaction.Transactional;
import org.imrofli.taskmanager.entity.Task;
import org.springframework.stereotype.Service;

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
}
