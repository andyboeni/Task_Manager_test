package org.imrofli.taskmanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.imrofli.taskmanager.dto.TaskRequest;
import org.imrofli.taskmanager.dto.TaskResponse;
import org.imrofli.taskmanager.entity.Task;
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
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    private ObjectMapper objectMapper;
    private Task sampleTask;
    private TaskRequest sampleRequest;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        sampleTask = new Task(1L, "Test Task", "Description", TaskStatus.TODO, TaskPriority.MEDIUM, "John Doe", LocalDate.now());
        sampleRequest = new TaskRequest("Test Task", "Description", TaskStatus.TODO, TaskPriority.MEDIUM, "John Doe", LocalDate.now());
    }

    @Test
    void getAllTasks_shouldReturnTaskList() throws Exception {
        when(taskService.getAllTasks()).thenReturn(List.of(sampleTask));

        mockMvc.perform(get("/api/tasks"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].title").value("Test Task"))
            .andExpect(jsonPath("$[0].assignee").value("John Doe"));
    }

    @Test
    void getTaskById_whenExists_shouldReturnTask() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.of(sampleTask));

        mockMvc.perform(get("/api/tasks/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void getTaskById_whenNotExists_shouldReturn404() throws Exception {
        when(taskService.getTaskById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/tasks/99"))
            .andExpect(status().isNotFound());
    }

    @Test
    void createTask_withValidRequest_shouldReturnCreated() throws Exception {
        when(taskService.createTask(any(Task.class))).thenReturn(sampleTask);

        mockMvc.perform(post("/api/tasks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sampleRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.title").value("Test Task"));
    }

    @Test
    void createTask_withBlankTitle_shouldReturn400() throws Exception {
        TaskRequest invalidRequest = new TaskRequest("", "Description", TaskStatus.TODO, TaskPriority.MEDIUM, "John Doe", LocalDate.now());

        mockMvc.perform(post("/api/tasks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void updateTask_whenExists_shouldReturnUpdatedTask() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskService.updateTask(any(Task.class))).thenReturn(sampleTask);

        mockMvc.perform(put("/api/tasks/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sampleRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void updateTask_whenNotExists_shouldReturn404() throws Exception {
        when(taskService.getTaskById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/tasks/99")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sampleRequest)))
            .andExpect(status().isNotFound());
    }

    @Test
    void deleteTask_whenExists_shouldReturn204() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.of(sampleTask)); // Not used by service but good practice
        doNothing().when(taskService).deleteTask(1L);

        mockMvc.perform(delete("/api/tasks/1"))
            .andExpect(status().isNoContent());
    }

    @Test
    void deleteTask_whenNotExists_shouldReturn404() throws Exception {
        doThrow(new TaskNotFoundException("Task not found")).when(taskService).deleteTask(99L);

        mockMvc.perform(delete("/api/tasks/99"))
            .andExpect(status().isNotFound());
    }

    @Test
    void patchTask_shouldUpdateOnlyProvidedFields() throws Exception {
        when(taskService.getTaskById(1L)).thenReturn(Optional.of(sampleTask));
        when(taskService.updateTask(any(Task.class))).thenReturn(sampleTask);

        String patchJson = "{\"title\": \"Updated Title\"}";

        mockMvc.perform(patch("/api/tasks/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(patchJson))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Updated Title"));
    }
}
