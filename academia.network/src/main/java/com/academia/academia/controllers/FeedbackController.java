package com.academia.academia.controllers;
import com.academia.academia.entities.Feedback;
import com.academia.academia.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // les feedbacks d'un article avec pagination
    @GetMapping("/article/{articleId}")
    public ResponseEntity<Page<Feedback>> getFeedbacksByArticleId(
            @PathVariable Integer articleId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Feedback> feedbacks = feedbackService.getFeedbacksByArticleId(articleId, pageable);
        return ResponseEntity.ok(feedbacks);
    }
    
    // Create a new feedback for an article
    @PostMapping("/article/{articleId}")
    public ResponseEntity<Feedback> createFeedback(
            @PathVariable Long articleId,
            @RequestBody Feedback feedback) {
        
        Feedback createdFeedback = feedbackService.createFeedback(feedback, articleId);
        return ResponseEntity.ok(createdFeedback);
    }
}
