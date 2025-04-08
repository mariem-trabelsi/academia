import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from "@angular/animations";
import { Article } from "../../../../services/models/article";
import { ArticleControllerService } from "../../../../services/services/article-controller.service";
import { ApproveArticle$Params } from "../../../../services/fn/article-controller/approve-article";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-archived-papers',
  templateUrl: './archived-papers.component.html',
  styleUrls: ['./archived-papers.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ArchivedPapersComponent implements OnInit {
  articles: Article[] = [];
  filePath: SafeResourceUrl | undefined;

  selectedArticle: Article | null = null;

  constructor(private articleService: ArticleControllerService, private sanitizer: DomSanitizer,) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  // Load only archived articles
  loadArticles(): void {
    this.articleService.getArchivedArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
      },
      error: (err) => {
        console.error('Failed to load archived articles', err);
      }
    });
  }

  // View article details
  viewArticleDetails(article: Article): void {
    this.selectedArticle = article;

      const fullPath = article.filePath;
      // @ts-ignore
      const fileName = fullPath.split(/[/\\]/).pop();

      const filePath = `assets/uploads/pdf/${fileName}`;
      this.filePath = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
  }

  // Close article details view
  closeArticleDetails(): void {
    this.selectedArticle = null;

  }

  // Unarchive article (set archived to false)
  unarchiveArticle(article: Article): void {
    if (article.id === undefined) {
      console.error('Article ID is undefined');
      return;
    }

    // Set archived to false
    article.archived = false;

    // Use the service to update the article status
    this.articleService.unarchiveArticle({ id: article.id }).subscribe(() => {
      this.loadArticles(); // Reload the list after unarchiving
      this.closeArticleDetails();
    });
  }





  // Get status class based on approval
  getStatusClass(archived: boolean | undefined): string {
    if (archived === true) return 'status-rejected';

    return 'status-pending';
  }
}

