package org.imrofli.taskmanager.service;

import org.imrofli.taskmanager.entity.Task;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;
import org.imrofli.taskmanager.exception.TaskNotFoundException;
import org.imrofli.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task sampleTask;

    @BeforeEach
    void setUp() {
        sampleTask = new Task(1L, "Test Task", "Description", TaskStatus.TODO, TaskPriority.MEDIUM, "John Doe", LocalDate.now());
    }

    @Test
    void getAllTasks_shouldReturnAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(sampleTask));
        
        List<Task> result = taskService.getAllTasks();
        
        assertEquals(1, result.size());
        assertEquals("Test Task", result.get(0).getTitle());
        verify(taskRepository).findAll();
    }

    @Test
    void getTaskById_whenExists_shouldReturnTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        
        Optional<Task> result = taskService.getTaskById(1L);
        
        assertTrue(result.isPresent());
        assertEquals("Test Task", result.get().getTitle());
    }

    @Test
    void getTaskById_whenNotExists_shouldReturnEmpty() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        
        Optional<Task> result = taskService.getTaskById(99L);
        
        assertFalse(result.isPresent());
    }

    @Test
    void createTask_shouldSaveAndReturnTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        
        Task result = taskService.createTask(sampleTask);
        
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository).save(sampleTask);
    }

    @Test
    void createTask_withBlankTitle_shouldThrowException() {
        Task invalidTask = new Task();
        invalidTask.setTitle(""); // Blank title
        
        assertThrows(IllegalArgumentException.class, () -> taskService.createTask(invalidTask));
        verify(taskRepository, never()).save(any());
    }

    @Test
    void updateTask_whenExists_shouldUpdateAndReturnTask() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        
        Task updatedTask = taskService.updateTask(sampleTask);
        
        assertNotNull(updatedTask);
        assertEquals("Test Task", updatedTask.getTitle());
        verify(taskRepository).save(sampleTask);
    }

    @Test
    void updateTask_whenNotExists_shouldThrowTaskNotFoundException() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());
        
        sampleTask.setId(99L);
        assertThrows(TaskNotFoundException.class, () -> taskService.updateTask(sampleTask));
    }

    @Test
    void deleteTask_whenExists_shouldDelete() {
        when(taskRepository.existsById(1L)).thenReturn(true);
        
        taskService.deleteTask(1L);
        
        verify(taskRepository).deleteById(1L);
    }

    @Test
    void deleteTask_whenNotExists_shouldThrowTaskNotFoundException() {
        when(taskRepository.existsById(99L)).thenReturn(false);
        
        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(99L));
        verify(taskRepository, never()).deleteById(anyLong());
    }

    @Test
    void getTasksWithPagination_withoutSearch_shouldReturnAll() {
        Pageable pageable = PageRequest.of(0, 10);
        when(taskRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(sampleTask)));
        
        List<Task> result = taskService.getTasksWithPagination(0, 10, null, "id", "ASC");
        
        assertEquals(1, result.size());
        verify(taskRepository).findAll(pageable);
    }

    @Test
    void getTasksWithPagination_withSearch_shouldCallSearchMethod() {
        Pageable pageable = PageRequest.of(0, 10);
        when(taskRepository.findByTitleContainingOrDescriptionContaining(
            eq("test"), eq("test"), any(Pageable.class)
        )).thenReturn(List.of(sampleTask));
        
        List<Task> result = taskService.getTasksWithPagination(0, 10, "Test", "id", "ASC");
        
        assertEquals(1, result.size());
        verify(taskRepository).findByTitleContainingOrDescriptionContaining("test", "test", pageable);
    }

    @Test
    void countTasks_withoutSearch_shouldReturnTotalCount() {
        when(taskRepository.count()).thenReturn(10L);
        
        Long count = taskService.countTasks(null);
        
        assertEquals(10L, count);
    }

    @Test
    void countTasks_withSearch_shouldReturnFilteredCount() {
        when(taskRepository.countByTitleContainingOrDescriptionContaining("test", "test")).thenReturn(3L);
        
        Long count = taskService.countTasks("Test");
        
        assertEquals(3L, count);
    }
}
