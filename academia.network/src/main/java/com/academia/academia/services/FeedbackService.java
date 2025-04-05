package com.academia.academia.services;

import com.academia.academia.entities.Article;
import com.academia.academia.entities.Feedback;
import com.academia.academia.repositories.ArticleRepository;
import com.academia.academia.repositories.FeedbackRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
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
        
        feedback.setArticle(article);
        return feedbackRepository.save(feedback);
    }
}
