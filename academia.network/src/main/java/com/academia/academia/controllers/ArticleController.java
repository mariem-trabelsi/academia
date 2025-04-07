package com.academia.academia.controllers;

import com.academia.academia.entities.Article;
import com.academia.academia.services.ArticleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }
    @PostMapping("/upload")
    public ResponseEntity<Article> uploadArticle(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("abstract_") String abstract_,
            @RequestParam("isbn") String isbn,
            @RequestParam("coverImage") String coverImage,
            @RequestParam("authorAffiliation") String authorAffiliation,
            @RequestParam("affiliation") String affiliation) {
        Article article = articleService.createArticleWithFile(file, title, abstract_ , isbn, authorAffiliation ,coverImage , affiliation);
        return ResponseEntity.ok(article);
    }
    /*
    @PostMapping("/upload")
    public ResponseEntity<Article> uploadArticle(
            @RequestParam("file") MultipartFile file,

            @RequestParam("title") String title,
            @RequestParam("abstract_") String abstract_,
            @RequestParam("isbn") String isbn,
            @RequestParam("authorAffiliation") String authorAffiliation,
            @RequestParam("affiliation") String affiliation,

            @RequestParam("articleCover") MultipartFile articleCover){

        try {
            // 1. Save the cover image to local folder
            Path uploadDir = Paths.get("uploads/images");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String coverFileName = UUID.randomUUID() + "_" + articleCover.getOriginalFilename();
            Path coverPath = uploadDir.resolve(coverFileName);
            Files.copy(articleCover.getInputStream(), coverPath, StandardCopyOption.REPLACE_EXISTING);

            String coverImagePath = "C:/Users/User/IdeaProjects/academia/uploads/images/" + coverFileName;

            // 2. Pass the cover image path to your service
            Article article = articleService.createArticleWithFile(
                    file,
                    title,
                    abstract_,
                    isbn,
                    authorAffiliation,
                    coverImagePath, // new path saved here
                    affiliation
            );

            return ResponseEntity.ok(article);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }*/




    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable("id") Long id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }


    @PostMapping
    public Article createArticle(@RequestBody Article article) {
        return articleService.createArticle(article);
    }

    @DeleteMapping("/{id}")
    public void deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Article>> getMyArticles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        List<Article> userArticles = articleService.getArticlesByCreatedBy(currentUsername);
        return ResponseEntity.ok(userArticles);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Article> approveArticle(@PathVariable("id") Long id) {
        Article updatedArticle = articleService.approveArticle(id);
        return ResponseEntity.ok(updatedArticle);
    }
    @GetMapping("/approved")
    public ResponseEntity<List<Article>> getApprovedArticles() {
        List<Article> notApprovedArticles = articleService.getArticlesApproved();
        return ResponseEntity.ok(notApprovedArticles);
    }


    @GetMapping("/{id}/domain")
    public ResponseEntity<String> getDomainName(@PathVariable("id") Long id) {
        String domainName = articleService.getDomainNameByArticleId(id);
        return ResponseEntity.ok(domainName);
    }
    
    // Get latest 5 articles
    @GetMapping("/latest5")
    public ResponseEntity<List<Article>> getLatest5Articles() {
        List<Article> latestArticles = articleService.getLatest5Articles();
        return ResponseEntity.ok(latestArticles);
    }
    
    // Get top 5 articles by feedback rating
    @GetMapping("/top5")
    public ResponseEntity<List<Article>> getTop5ArticlesByRating() {
        List<Article> topArticles = articleService.getTop5ArticlesByRating();
        return ResponseEntity.ok(topArticles);
    }


}
