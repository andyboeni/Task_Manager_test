package org.imrofli.taskmanager.repository;

import jakarta.persistence.EntityManager;
import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Import(TaskRepository.class)
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EntityManager entityManager;

    private List<Task> testTasks = List.of(
            new Task(1L, "Test Task 1", "This is a test description", TaskStatus.TODO, TaskPriority.MEDIUM, null),
            new Task(2L, "Test Task 2", null, TaskStatus.IN_PROGRESS, TaskPriority.HIGH, null)
    );

    @Test
    void testFindAllTasks() {
        entityManager.persist(testTasks.get(0));
        entityManager.persist(testTasks.get(1));
        entityManager.flush();

        List<Task> result = taskRepository.findAll();
        
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Task 1");
        assertThat(result.get(1).getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
    }

    @Test
    void testFindTaskById_Found() {
        Long existingId = 1L;
        entityManager.persist(testTasks.get(0));
        entityManager.flush();

        Optional<Task> result = taskRepository.findById(existingId);
        
        assertTrue(result.isPresent());
        assertEquals("Test Task 1", result.get().getTitle());
    }

    @Test
    void testFindTaskById_NotFound() {
        Long nonExistingId = 3L;
        Optional<Task> result = taskRepository.findById(nonExistingId);
        
        assertFalse(result.isPresent());
    }
}
