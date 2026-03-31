package org.imrofli.taskmanager.dto;

import org.imrofli.taskmanager.entity.TaskPriority;
import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    LocalDate dueDate
) {}
