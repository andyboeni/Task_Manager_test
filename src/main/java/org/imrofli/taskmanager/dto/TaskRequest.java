package org.imrofli.taskmanager.dto;

import jakarta.validation.constraints.Size;
import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskRequest(
    String title,
    String description,
    TaskStatus status,
    LocalDate dueDate
) {}

public record TaskPatchRequest(
    String title,
    String description,
    TaskStatus status,
    LocalDate dueDate
) {}
