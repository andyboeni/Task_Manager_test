package org.imrofli.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
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
