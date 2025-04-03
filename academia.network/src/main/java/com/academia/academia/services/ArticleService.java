package com.academia.academia.services;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Domain;
import com.academia.academia.repositories.ArticleRepository;
import com.academia.academia.repositories.DomainRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    @Autowired
    private final ArticleRepository articleRepository;

    @Autowired
    private DomainRepository domainRepository;


    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }

    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }

    public List<Article> getArticlesByCreatedBy(String username) {
        return articleRepository.findByCreatedBy(username);
    }

    public Article approveArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        article.setApproved(true);
        return articleRepository.save(article);
    }

    public List<Article> getArticlesApproved() {
        return articleRepository.findByApprovedTrueOrderByCreatedDateDesc();
    }

    public String getDomainNameByArticleId(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        if (article.getDomain() != null) {
            return article.getDomain().getName();
        }
        return "No domain assigned";
    }


}
