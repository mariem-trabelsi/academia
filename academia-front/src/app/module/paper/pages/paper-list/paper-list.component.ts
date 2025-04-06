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
  articles: Article[] = [];
  papers: Paper[] = [];
  loading = false;
  filter: PaperFilter = {};
  confirmingDeleteId: number | null = null;

  constructor(
    private articleService:ArticleControllerService,
    private paperService: PaperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArticles();
  }
  // Get all Articles
  loadArticles(): void {
    this.loading = true;
    this.articleService.getAllArticles().subscribe(
      (data: Article[]) => {
        this.articles = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading articles:', error);
        this.loading = false;
      }
    );
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
      this.articleService.deleteArticle({ id: this.confirmingDeleteId }).subscribe({
        next: () => {
          this.articles = this.articles.filter(article => article.id !== this.confirmingDeleteId);
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting article:', error);
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

  loadPapers(): void {
    this.loading = true;
    this.paperService.getPapers(this.filter).subscribe({
      next: (papers) => {
        this.papers = papers;
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






  createNewPaper(): void {
    this.router.navigate(['/papers/new']);
  }
}
