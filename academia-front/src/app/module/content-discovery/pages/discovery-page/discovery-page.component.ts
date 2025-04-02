import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../../../services/models/article';
import { ArticleControllerService } from '../../../../services/services/article-controller.service';
import { TopicFilter } from '../../models/discovery';

@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.component.html',
  styleUrls: ['./discovery-page.component.scss']
})
export class DiscoveryPageComponent implements OnInit {

  filter: TopicFilter = {};
  loading = true;
  activeSection = 'recommended';
  articles: Article[] = [];

  constructor(
    private articleService: ArticleControllerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDiscoveryData();
  }

  loadDiscoveryData(): void {
    this.loading = true;

    this.articleService.getAllArticles().subscribe({
      next: (data: Article[]) => {
        this.articles = data;
        console.log('Articles loaded:', this.articles);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des articles:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(filter: TopicFilter): void {
    this.filter = filter;
    this.loadDiscoveryData();
  }

  viewPaper(paperId: number | undefined): void {
    if (paperId !== undefined) {
      this.router.navigate(['/papers', paperId]);
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}
