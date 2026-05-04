package org.imrofli.taskmanager.repository;

import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    private Task task1;
    private Task task2;

    @BeforeEach
    void setUp() {
        task1 = new Task(null, "Fix bug A", "Description A", TaskStatus.TODO, TaskPriority.HIGH, "Alice", LocalDate.now());
        task2 = new Task(null, "Feature B", "Description B", TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, "Bob", LocalDate.now());
        
        taskRepository.saveAll(List.of(task1, task2));
    }

    @Test
    void findByTitleContainingOrDescriptionContaining_shouldReturnMatchingTasks() {
        Pageable pageable = PageRequest.of(0, 10);
        
        List<Task> result = taskRepository.findByTitleContainingOrDescriptionContaining("bug", "bug", pageable);
        
        assertEquals(1, result.size());
        assertEquals("Fix bug A", result.get(0).getTitle());
    }

    @Test
    void findByTitleContainingOrDescriptionContaining_withNoMatch_shouldReturnEmpty() {
        Pageable pageable = PageRequest.of(0, 10);
        
        List<Task> result = taskRepository.findByTitleContainingOrDescriptionContaining("nonexistent", "nonexistent", pageable);
        
        assertTrue(result.isEmpty());
    }

    @Test
    void countByTitleContainingOrDescriptionContaining_shouldReturnCorrectCount() {
        long count = taskRepository.countByTitleContainingOrDescriptionContaining("Description", "Description");
        
        assertEquals(2, count);
    }

    @Test
    void countByTitleContainingOrDescriptionContaining_withNoMatch_shouldReturnZero() {
        long count = taskRepository.countByTitleContainingOrDescriptionContaining("nonexistent", "nonexistent");
        
        assertEquals(0, count);
    }
}
