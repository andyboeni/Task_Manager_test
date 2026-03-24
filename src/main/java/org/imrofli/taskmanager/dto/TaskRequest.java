package org.imrofli.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskRequest(
    @NotBlank @Size(max = 100) String title,
    @Size(max = 500) String description,
    TaskStatus status,
    LocalDate dueDate
) {}
