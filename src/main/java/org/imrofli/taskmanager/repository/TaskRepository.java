package org.imrofli.taskmanager.repository;

import org.imrofli.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Custom query methods can be added here if needed
}
