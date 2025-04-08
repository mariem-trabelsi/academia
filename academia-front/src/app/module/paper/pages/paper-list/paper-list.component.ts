import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paper, PaperFilter } from '../../models/paper';
import { PaperService } from '../../services/paper.service';
import {Article} from "../../../../services/models/article";
import {ArticleControllerService} from "../../../../services/services/article-controller.service";

@Component({
  selector: 'app-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit {
  papers: Paper[] = [];
  articles: Article[] = [];
  loading = false;
  filter: PaperFilter = {};
  confirmingDeleteId: number | null = null;

  constructor(
    private articleService:ArticleControllerService,
    private paperService: PaperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPapers();
  }

  loadPapers(): void {
    this.loading = true;

    this.articleService.getMyArticles(this.filter).subscribe({
      next: (data: Article[]) => {
        console.log('Articles after archiving: ', this.articles);
        this.articles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading papers:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(filter: PaperFilter): void {
    this.filter = filter;
    this.loadPapers();
  }


  // Store selected ID and open confirmation modal
  onDeleteRequest(id: number): void {
    console.log('Delete requested for article ID:', id);
    this.confirmingDeleteId = id;
    document.body.style.overflow = 'hidden';
  }
  // Confirm delete
  confirmDelete(): void {
    if (this.confirmingDeleteId) {
      // Send request to archive the article instead of deleting it
      this.articleService.archiveArticle({ id: this.confirmingDeleteId }).subscribe({
        next: (updatedArticle) => {
          this.loadPapers();
          this.articles = this.articles.map(article =>
            article.id === this.confirmingDeleteId ? { ...article, archived: true } : article
          );
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error archiving article:', error);
          this.cancelDelete();
        }
      });
    }
  }

  // cancel delete
  cancelDelete(): void {
    this.confirmingDeleteId = null;
    document.body.style.overflow = ''; // Restore scrolling
  }
  // Get the title of Article to delete
  getArticleTitleToDelete(): string | undefined {
    const article = this.articles.find(a => a.id === this.confirmingDeleteId);
    return article ? article.title : undefined;
  }

  createNewPaper(): void {
    this.router.navigate(['/papers/new']);
  }
}
