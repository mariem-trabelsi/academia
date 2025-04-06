package com.academia.academia.repositories;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCreatedBy(String createdBy);
    List<Article> findByDomain(Domain domain);
    List<Article> findByArchived(boolean archived);
}
