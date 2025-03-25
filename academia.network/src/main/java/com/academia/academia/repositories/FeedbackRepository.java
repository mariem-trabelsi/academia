package com.academia.academia.repositories;

import com.academia.academia.entities.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    @Query("""
        SELECT feedback
        FROM Feedback feedback
        WHERE feedback.article.id = :articleId
    """)
    Page<Feedback> findAllByArticleId(@Param("articleId") Integer articleId, Pageable pageable);
}
