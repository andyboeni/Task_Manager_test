package org.imrofli.taskmanager.entity;

import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Entity
@Table(name = "tasks", indexes = {
    @Index(columnList = "title", name = "task_title_index")
})
public class Task {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{validation.title.not_blank}")
    @Size(max = 100, message = "{validation.title.max_length}")
    @Column(nullable = false, updatable = true, columnDefinition = "VARCHAR(100)")
    private String title;

    @Size(max = 500, message = "{validation.description.max_length}")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = true)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, updatable = true)
    private TaskPriority priority = TaskPriority.MEDIUM;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    // Default constructor
    public Task() {}

    // Constructor for testing
    public Task(Long id, String title, String description, TaskStatus status, TaskPriority priority, LocalDate dueDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", priority=" + priority +
                ", dueDate=" + dueDate +
                '}';
    }
}
