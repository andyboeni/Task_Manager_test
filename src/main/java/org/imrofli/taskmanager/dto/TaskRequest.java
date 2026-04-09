package org.imrofli.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskRequest(
    @NotBlank(groups = OnCreate.class) @Size(max = 100, groups = {OnCreate.class, OnUpdate.class}) String title,
    @Size(max = 500, groups = {OnCreate.class, OnUpdate.class}) String description,
    @NotBlank(groups = OnCreate.class) TaskStatus status,
    @NotNull                    TaskPriority priority,
    LocalDate dueDate
) {}
package org.imrofli.taskmanager.service;

import org.imrofli.taskmanager.dto.TaskRequest;
import org.imrofli.taskmanager.dto.TaskResponse;
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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    private TaskRequest taskRequest;
    private Task task;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        taskRequest = new TaskRequest(
            "Test Task",
            "Test Description",
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            LocalDate.now()
        );

        task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);
        task.setDueDate(LocalDate.now());

        taskResponse = new TaskResponse(
            1L,
            "Test Task",
            "Test Description",
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            LocalDate.now()
        );
    }

    @Test
    void createTask_Success() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse result = taskService.create(taskRequest);

        assertNotNull(result);
        assertEquals(taskResponse.id(), result.id());
        assertEquals(taskResponse.title(), result.title());
        assertEquals(taskResponse.description(), result.description());
        assertEquals(taskResponse.status(), result.status());
        assertEquals(taskResponse.priority(), result.priority());
        assertEquals(taskResponse.dueDate(), result.dueDate());

        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void getAllTasks_Success() {
        when(taskRepository.findAll()).thenReturn(Arrays.asList(task));

        List<TaskResponse> result = taskService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(taskResponse.id(), result.get(0).id());
        assertEquals(taskResponse.title(), result.get(0).title());

        verify(taskRepository, times(1)).findAll();
    }

    @Test
    void getTaskById_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskResponse result = taskService.getById(1L);

        assertNotNull(result);
        assertEquals(taskResponse.id(), result.id());
        assertEquals(taskResponse.title(), result.title());

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void getTaskById_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.getById(1L));

        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    void updateTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse result = taskService.update(1L, taskRequest);

        assertNotNull(result);
        assertEquals(taskResponse.id(), result.id());
        assertEquals(taskResponse.title(), result.title());

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void updateTask_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.update(1L, taskRequest));

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_Success() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.delete(1L);

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void deleteTask_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(TaskNotFoundException.class, () -> taskService.delete(1L));

        verify(taskRepository, times(1)).findById(1L);
        verify(taskRepository, never()).delete(any(Task.class));
    }
}
package org.imrofli.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.imrofli.taskmanager.dto.TaskRequest;
import org.imrofli.taskmanager.dto.TaskResponse;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;
import org.imrofli.taskmanager.exception.TaskNotFoundException;
import org.imrofli.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    private TaskRequest taskRequest;
    private TaskResponse taskResponse;

    @BeforeEach
    void setUp() {
        taskRequest = new TaskRequest(
            "Test Task",
            "Test Description",
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            LocalDate.now()
        );

        taskResponse = new TaskResponse(
            1L,
            "Test Task",
            "Test Description",
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            LocalDate.now()
        );
    }

    @Test
    void createTask_Success() throws Exception {
        when(taskService.create(any(TaskRequest.class))).thenReturn(taskResponse);

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService, times(1)).create(any(TaskRequest.class));
    }

    @Test
    void createTask_InvalidRequest() throws Exception {
        TaskRequest invalidRequest = new TaskRequest(
            "", // blank title
            "Test Description",
            TaskStatus.TODO,
            TaskPriority.MEDIUM,
            LocalDate.now()
        );

        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());

        verify(taskService, never()).create(any(TaskRequest.class));
    }

    @Test
    void getAllTasks_Success() throws Exception {
        when(taskService.getAll()).thenReturn(Arrays.asList(taskResponse));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Test Task"));

        verify(taskService, times(1)).getAll();
    }

    @Test
    void getTaskById_Success() throws Exception {
        when(taskService.getById(1L)).thenReturn(taskResponse);

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService, times(1)).getById(1L);
    }

    @Test
    void getTaskById_NotFound() throws Exception {
        when(taskService.getById(1L)).thenThrow(new TaskNotFoundException("Task not found"));

        mockMvc.perform(get("/api/tasks/1"))
                .andExpect(status().isNotFound());

        verify(taskService, times(1)).getById(1L);
    }

    @Test
    void updateTask_Success() throws Exception {
        when(taskService.update(eq(1L), any(TaskRequest.class))).thenReturn(taskResponse);

        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Task"));

        verify(taskService, times(1)).update(eq(1L), any(TaskRequest.class));
    }

    @Test
    void updateTask_NotFound() throws Exception {
        when(taskService.update(eq(1L), any(TaskRequest.class)))
                .thenThrow(new TaskNotFoundException("Task not found"));

        mockMvc.perform(put("/api/tasks/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(taskRequest)))
                .andExpect(status().isNotFound());

        verify(taskService, times(1)).update(eq(1L), any(TaskRequest.class));
    }

    @Test
    void deleteTask_Success() throws Exception {
        doNothing().when(taskService).delete(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNoContent());

        verify(taskService, times(1)).delete(1L);
    }

    @Test
    void deleteTask_NotFound() throws Exception {
        doThrow(new TaskNotFoundException("Task not found"))
                .when(taskService).delete(1L);

        mockMvc.perform(delete("/api/tasks/1"))
                .andExpect(status().isNotFound());

        verify(taskService, times(1)).delete(1L);
    }
}
