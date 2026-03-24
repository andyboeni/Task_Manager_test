package org.imrofli.taskmanager.dto;

import org.imrofli.taskmanager.entity.TaskStatus;

import java.time.LocalDate;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status,
    LocalDate dueDate
) {}
