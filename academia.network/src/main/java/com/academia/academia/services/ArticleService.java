package com.academia.academia.services;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Domain;
import com.academia.academia.repositories.ArticleRepository;
import com.academia.academia.repositories.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

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
        return articleRepository.findByArchivedFalse();
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
        return articleRepository.findByCreatedByAndArchivedFalse(username);
    }

    public Article approveArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        article.setApproved(true);
        return articleRepository.save(article);
    }
    public Article archiveArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setArchived(true);
        return articleRepository.save(article);
    }
    public Article unarchiveArticle(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
        article.setArchived(false);
        return articleRepository.save(article);
    }
    public List<Article> getArchivedArticles() {
        return articleRepository.findByArchived(true);
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

    // Get latest 5 approved articles
    public List<Article> getLatest5Articles() {
        return articleRepository.findLatest5ApprovedArticles(PageRequest.of(0, 5));
    }
    
    // Get top 5 articles with best average feedback ratings
    public List<Article> getTop5ArticlesByRating() {
        return articleRepository.findTop5ArticlesByAverageRating(PageRequest.of(0, 5));
    }
    //private static final String UPLOAD_DIR_pdf = System.getProperty("user.dir") + File.separator + "uploads/pdf" + File.separator;
    //private static final String UPLOAD_DIR_images = System.getProperty("user.dir") + File.separator + "uploads/images" + File.separator;
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

    public Article createArticleWithFile(MultipartFile file, String title, String abstract_, String isbn,
                                         String authorAffiliation, String coverImage, String affiliation, Domain domain) {
        try {
            // Define the upload directory relative to your application path
            //File uploadDir = new File("src/main/resources/static/uploads");
            File uploadDir = new File("C:/Users/User/IdeaProjects/academia/academia-front/src/assets/uploads");

            // Create the directory if it doesn't exist
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }


            // Save the file in the uploads folder
            Path filePath = Paths.get(uploadDir + File.separator + file.getOriginalFilename());
            Files.write(filePath, file.getBytes());

            // Create and save the article entity
            Article article = new Article();
            article.setTitle(title);
            article.setAbstract_(abstract_);
            article.setIsbn(isbn);
            article.setAuthorAffiliation(authorAffiliation);
            article.setAffiliation(affiliation);
            article.setArticleCover(coverImage);
            article.setFilePath(filePath.toString()); // Save the file path in the database
            article.setDomain(domain);
            return articleRepository.save(article);
        } catch (IOException e) {
            throw new RuntimeException("Error while saving the file", e);
        }
    }






    public Article updateArticleWithFile(Long articleId, MultipartFile file, String title, String abstract_,
                                         String isbn, String authorAffiliation, String coverImage,
                                         String affiliation, Domain domain) {
        try {
            Article existingArticle = articleRepository.findById(articleId)
                    .orElseThrow(() -> new RuntimeException("Article not found"));

            // Update fields
            existingArticle.setTitle(title);
            existingArticle.setAbstract_(abstract_);
            existingArticle.setIsbn(isbn);
            existingArticle.setAuthorAffiliation(authorAffiliation);
            existingArticle.setAffiliation(affiliation);
            existingArticle.setArticleCover(coverImage);
            existingArticle.setDomain(domain);

            // Handle file update if provided
            if (file != null && !file.isEmpty()) {
                File uploadDir = new File("C:/Users/User/IdeaProjects/academia/academia-front/src/assets/uploads");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Delete old file if exists
                if (existingArticle.getFilePath() != null) {
                    Files.deleteIfExists(Paths.get(existingArticle.getFilePath()));
                }

                // Save new file
                Path filePath = Paths.get(uploadDir + File.separator + file.getOriginalFilename());
                Files.write(filePath, file.getBytes());
                existingArticle.setFilePath(filePath.toString());
            }

            return articleRepository.save(existingArticle);
        } catch (IOException e) {
            throw new RuntimeException("Error while updating the article", e);
        }
    }









/*
    public Article createArticleWithFile(MultipartFile file, String title,String abstract_ , String isbn, String authorAffiliation, String coverImage ,String affiliation) {
        try {
            // Vérifier et créer le dossier si besoin pdff !!
            File uploadDir = new File(UPLOAD_DIR_pdf);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            File uploadDir_image = new File(UPLOAD_DIR_images);
            if (!uploadDir_image.exists()) {
                uploadDir_image.mkdirs();
            }


            // Sauvegarde du fichier
            Path filePath = Paths.get(UPLOAD_DIR_pdf + file.getOriginalFilename());
            Files.write(filePath, file.getBytes());
            Path articleCover = Paths.get(UPLOAD_DIR_images + file.getOriginalFilename());
            Files.write(articleCover, file.getBytes());
            // Création de l'article
            Article article = new Article();
            article.setTitle(title);
            article.setAbstract_(abstract_);
            article.setIsbn(isbn);
            article.setAuthorAffiliation(authorAffiliation);
            article.setAffiliation(affiliation);

            article.setImagePath(articleCover.toString());

            article.setFilePath(filePath.toString()); // Sauvegarde du chemin

            return articleRepository.save(article);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement du fichier", e);
        }
    }

*/
}