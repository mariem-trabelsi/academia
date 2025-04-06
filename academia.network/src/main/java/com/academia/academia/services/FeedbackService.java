package com.academia.academia.services;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Feedback;
import com.academia.academia.repositories.ArticleRepository;
import com.academia.academia.repositories.FeedbackRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }


    public Optional<Feedback> getFeedbackById(Integer id) {
        return feedbackRepository.findById(id);
    }


    public Page<Feedback> getFeedbacksByArticleId(Integer articleId, Pageable pageable) {
        return feedbackRepository.findAllByArticleId(articleId, pageable);
    }



    public void deleteFeedback(Integer id) {
        feedbackRepository.deleteById(id);
    }
    
    // Create a new feedback for an article
    public Feedback createFeedback(Feedback feedback, Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found with id: " + articleId));
        
        // Get current user information from the authentication context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            
            // Extract user's name from the token claims
            String name = "";
            
            // Try to get name from preferred_username or given_name + family_name
            if (jwt.getClaim("preferred_username") != null) {
                name = jwt.getClaim("preferred_username");
            }
            
            // Check for given_name and family_name which are more likely to be the full name
            String givenName = jwt.getClaim("given_name");
            String familyName = jwt.getClaim("family_name");
            
            if (givenName != null && familyName != null) {
                name = givenName + " " + familyName;
            } else if (givenName != null) {
                name = givenName;
            } else if (familyName != null) {
                name = familyName;
            }
            
            // Check for name claim directly
            if (name.isEmpty() && jwt.getClaim("name") != null) {
                name = jwt.getClaim("name");
            }
            
            // If we got a name, set it in the feedback
            if (!name.isEmpty()) {
                feedback.setCreatorFullName(name);
            } else {
                // Fallback to using the UID as name
                feedback.setCreatorFullName(authentication.getName());
            }
        } else {
            // Fallback in case authentication is not available
            feedback.setCreatorFullName("Anonymous User");
        }
        
        feedback.setArticle(article);
        return feedbackRepository.save(feedback);
    }
}
