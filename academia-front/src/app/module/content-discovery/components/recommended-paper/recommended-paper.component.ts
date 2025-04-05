import { Component, Input } from '@angular/core';
import { ArticleControllerService } from 'src/app/services/services';
import { Article } from 'src/app/services/models';

@Component({
  selector: 'app-recommended-paper',
  templateUrl: './recommended-paper.component.html',
  styleUrls: ['./recommended-paper.component.scss']
})
export class RecommendedPaperComponent {
  @Input() article!: Article;

  getArticleRating(): number {
    // Check if article has feedbacks
    if (!this.article.feedbacks || this.article.feedbacks.length === 0) {
      return 0;
    }
    
    // Calculate average rating from feedbacks
    const totalRating = this.article.feedbacks.reduce((sum, feedback) => {
      return sum + (feedback.note || 0);
    }, 0);
    
    return totalRating / this.article.feedbacks.length;
  }

  getRatingStars(): number[] {
    const rating = this.getArticleRating();
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(0.5);
    }

    // Fill the rest with empty stars
    while (stars.length < 5) {
      stars.push(0);
    }

    return stars;
  }
}
