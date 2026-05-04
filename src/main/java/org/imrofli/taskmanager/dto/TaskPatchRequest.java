package org.imrofli.taskmanager.dto;

import jakarta.validation.constraints.Size;
import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskPatchRequest(
    @Size(max = 100) String title,
    @Size(max = 500) String description,
    TaskStatus status,
    TaskPriority priority,
    @Size(max = 100) String assignee,
    LocalDate dueDate
) {}
