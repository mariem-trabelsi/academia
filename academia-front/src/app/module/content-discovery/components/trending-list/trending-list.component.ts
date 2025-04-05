import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/services/models/article';
import { ArticleControllerService } from 'src/app/services/services/article-controller.service';

@Component({
  selector: 'app-trending-list',
  templateUrl: './trending-list.component.html',
  styleUrls: ['./trending-list.component.scss']
})
export class TrendingListComponent implements OnInit {
  topArticles: Article[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private articleService: ArticleControllerService) { }

  ngOnInit(): void {
    this.loadTopArticles();
  }

  loadTopArticles(): void {
    this.loading = true;
    this.error = null;
    
    this.articleService.getTop5Articles().subscribe({
      next: (articles) => {
        this.topArticles = articles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading top articles:', err);
        this.error = 'Failed to load trending articles. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  getArticleRating(article: Article): number {
    // Check if article has feedbacks
    if (!article.feedbacks || article.feedbacks.length === 0) {
      return 0;
    }
    
    // Calculate average rating from feedbacks
    const totalRating = article.feedbacks.reduce((sum, feedback) => {
      return sum + (feedback.note || 0);
    }, 0);
    
    return totalRating / article.feedbacks.length;
  }

  getRatingStars(rating: number): number[] {
    if (!rating) return [0, 0, 0, 0, 0];

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
