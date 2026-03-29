package org.imrofli.taskmanager.repository;

import org.imrofli.taskmanager.entity.Task;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE %:searchTerm% OR LOWER(t.description) LIKE %:searchTerm%")
    List<Task> findByTitleContainingOrDescriptionContaining(
        @Param("searchTerm") String searchTerm,
        Pageable pageable);

    @Query("SELECT COUNT(t) FROM Task t WHERE LOWER(t.title) LIKE %:searchTerm% OR LOWER(t.description) LIKE %:searchTerm%")
    Long countByTitleContainingOrDescriptionContaining(
        @Param("searchTerm") String searchTerm);

    List<Task> findAll(Pageable pageable);
}
