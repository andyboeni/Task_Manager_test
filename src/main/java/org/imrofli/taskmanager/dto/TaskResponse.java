package org.imrofli.taskmanager.dto;

import java.util.List;

public record PaginatedResponse(
    List<TaskResponse> tasks,
    Long totalItems
) {}
