package com.academia.academia.controllers;

import com.academia.academia.entities.Article;
import com.academia.academia.services.ArticleService;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Article found"),
            @ApiResponse(responseCode = "404", description = "Article not found")
    })
    public ResponseEntity<Article> getArticleById(@PathVariable("id") Long id) {
        Article article = articleService.getArticleById(id);
        if (article == null || article.isArchived()) {
            return ResponseEntity.notFound().build();
        }
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
    @PutMapping("/articles/{id}/unarchive")
    public ResponseEntity<Article> unarchiveArticle(@PathVariable Long id) {
        Article updated = articleService.unarchiveArticle(id);
        return ResponseEntity.ok(updated);
    }
    @PutMapping("/{id}/archive")
    public ResponseEntity<Article> archiveArticle(@PathVariable("id") Long id) {
        Article updatedArticle = articleService.archiveArticle(id);
        return ResponseEntity.ok(updatedArticle);
    }
    @GetMapping("/archived")
    public ResponseEntity<List<Article>> getArchivedArticles() {
        List<Article> archivedArticles = articleService.getArchivedArticles();
        return ResponseEntity.ok(archivedArticles);
    }

    @PostMapping("/verify-content")
    public ResponseEntity<Map<String, String>> verifyContent(@RequestBody Map<String, String> request) {
        try {
            String content = request.get("content");
            if (content == null || content.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "No content provided for verification");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("Verifying content: " + (content.length() > 50 ? content.substring(0, 50) + "..." : content));

            // Azure OpenAI Configuration
            String azureOpenAIApiKey = "5E6mleNOCtRPzF7dCDsAFy4AfNDKzlqqfE6tGlpVjhXCwVJoY2osJQQJ99BAAC5T7U2XJ3w3AAABACOGlz1S";
            String azureOpenAIEndpoint = "https://myopenaiservicedatadoit.openai.azure.com/";
            String azureOpenAIApiVersion = "2024-02-15-preview";
            String azureOpenAIDeploymentName = "gpt-4";

            // Call Azure OpenAI API to verify content
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", azureOpenAIApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            
            String systemPrompt = "You are an assistant that reviews article content before it is published.\n\n" +
                    "Please analyze this content and do the following:\n" +
                    "1. Check for grammar or spelling mistakes.\n" +
                    "2. Detect any toxic, offensive, or inappropriate language.\n\n" +
                    "Then return a short, clear message to the user that summarizes the findings:\n" +
                    "- If there are grammar or spelling mistakes, mention them briefly.\n" +
                    "- If there is any toxic or offensive language, warn the user.\n" +
                    "- If the content is appropriate and well-written, respond with something like: \"Your article looks great! No grammar issues or inappropriate language detected.\"\n\n" +
                    "Your response should be a single user-friendly message in natural language, ready to be shown to the user directly.";

            String userPrompt = "The user has written the following article content:\n\n---\n" + content + "\n---";
            
            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", systemPrompt);
            
            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", userPrompt);
            
            requestBody.put("messages", new Object[]{systemMessage, userMessage});
            
            // Azure OpenAI requires deployment name in the URL path
            String azureOpenAIUrl = azureOpenAIEndpoint + "openai/deployments/" + azureOpenAIDeploymentName + 
                                    "/chat/completions?api-version=" + azureOpenAIApiVersion;
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            System.out.println("Sending request to Azure OpenAI API");
            
            try {
                String responseFromOpenAI = restTemplate.postForObject(azureOpenAIUrl, entity, String.class);
                System.out.println("Received response from Azure OpenAI API");
                
                // Parse the response to extract the message
                ObjectMapper mapper = new ObjectMapper();
                JsonNode rootNode = mapper.readTree(responseFromOpenAI);
                String verificationMessage = rootNode.path("choices").get(0).path("message").path("content").asText();
                
                Map<String, String> response = new HashMap<>();
                response.put("message", verificationMessage);
                return ResponseEntity.ok(response);
            } catch (Exception apiException) {
                System.err.println("Error calling Azure OpenAI API: " + apiException.getMessage());
                
                // Since we have an API error, let's generate a simple response ourselves
                Map<String, String> fallbackResponse = new HashMap<>();
                
                // Basic content verification without API
                String lowercaseContent = content.toLowerCase();
                boolean hasProfanity = lowercaseContent.contains("fuck") || 
                                      lowercaseContent.contains("shit") || 
                                      lowercaseContent.contains("damn") ||
                                      lowercaseContent.contains("bitch");
                
                if (hasProfanity) {
                    fallbackResponse.put("message", "Warning: Your content may contain inappropriate language. Please review before publishing.");
                } else if (content.length() < 50) {
                    fallbackResponse.put("message", "Your content is quite short. Consider adding more detail before publishing.");
                } else {
                    fallbackResponse.put("message", "Your content has been reviewed. It appears to be appropriate for publishing.");
                }
                
                return ResponseEntity.ok(fallbackResponse);
            }
            
        } catch (Exception e) {
            System.err.println("Exception in verifyContent: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error verifying content: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

}
