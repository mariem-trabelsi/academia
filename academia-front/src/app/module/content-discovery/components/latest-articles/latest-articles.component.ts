import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/services/models/article';
import { ArticleControllerService } from 'src/app/services/services/article-controller.service';

@Component({
  selector: 'app-latest-articles',
  templateUrl: './latest-articles.component.html',
  styleUrls: ['./latest-articles.component.scss']
})
export class LatestArticlesComponent implements OnInit {
  latestArticles: Article[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private articleService: ArticleControllerService) { }

  ngOnInit(): void {
    this.loadLatestArticles();
  }

  loadLatestArticles(): void {
    this.loading = true;
    this.error = null;
    
    this.articleService.getLatest5Articles().subscribe({
      next: (articles) => {
        this.latestArticles = articles;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading latest articles:', err);
        this.error = 'Failed to load the latest articles. Please try again later.';
        this.loading = false;
      }
    });
  }
} 