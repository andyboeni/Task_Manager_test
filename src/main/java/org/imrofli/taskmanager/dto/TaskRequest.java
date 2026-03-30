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
    TaskPriority priority,
    LocalDate dueDate
) {}

public record TaskPatchRequest(
    @Size(max = 100, groups = OnUpdate.class) String title,
    @Size(max = 500, groups = OnUpdate.class) String description,
    TaskStatus status,
    TaskPriority priority,
    LocalDate dueDate
) {}

public interface OnCreate {}
public interface OnUpdate {}
