package org.imrofli.taskmanager.service;

import jakarta.transaction.Transactional;
import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.entity.TaskStatus;
import org.imrofli.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@SpringBootTest
class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @MockBean
    private TaskRepository taskRepository;

    private List<Task> testTasks = new ArrayList<>();

    @BeforeEach
    void setUp() {
        testTasks.add(new Task(1L, "Test Task 1", "This is a test description", TaskStatus.TODO, null));
        testTasks.add(new Task(2L, "Test Task 2", null, TaskStatus.IN_PROGRESS, null));

        when(taskRepository.findAll()).thenReturn(testTasks);
    }

    @Test
    void testGetAllTasks() {
        List<Task> result = taskService.getAllTasks();
        
        assertEquals(2, result.size());
        assertEquals("Test Task 1", result.get(0).getTitle());
        assertEquals(TaskStatus.IN_PROGRESS, result.get(1).getStatus());
        
        verify(taskRepository).findAll();
    }

    @Test
    void testGetTaskById_Found() {
        Long existingId = 1L;
        when(taskRepository.findById(existingId)).thenReturn(Optional.of(testTasks.get(0)));

        Optional<Task> result = taskService.getTaskById(existingId);
        
        assertTrue(result.isPresent());
        assertEquals("Test Task 1", result.get().getTitle());
    }

    @Test
    void testGetTaskById_NotFound() {
        Long nonExistingId = 3L;
        when(taskRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        Optional<Task> result = taskService.getTaskById(nonExistingId);
        
        assertFalse(result.isPresent());
    }
}
