package com.academia.academia.repositories;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCreatedBy(String createdBy);
    List<Article> findByDomain(Domain domain);
    Optional<Article> findById(Long id);
    public List<Article> findByApprovedTrueOrderByCreatedDateDesc();
    List<Article> findByArchived(boolean archived);
    List<Article> findByArchivedFalse();
    List<Article> findByCreatedByAndArchivedFalse(String createdBy);
    // Find the latest 5 approved articles
    @Query("SELECT a FROM Article a WHERE a.approved = true ORDER BY a.createdDate DESC")
    List<Article> findLatest5ApprovedArticles(Pageable pageable);
    
    // Find top 5 articles with best feedback rating average
    @Query("SELECT a FROM Article a JOIN a.feedbacks f WHERE a.approved = true GROUP BY a ORDER BY AVG(f.note) DESC")
    List<Article> findTop5ArticlesByAverageRating(Pageable pageable);
}
