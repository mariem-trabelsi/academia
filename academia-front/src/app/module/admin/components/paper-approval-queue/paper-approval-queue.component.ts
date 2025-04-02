import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { PaperApproval } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { ArticleControllerService } from 'src/app/services/services';
import { Article } from 'src/app/services/models';
import { ApproveArticle$Params } from 'src/app/services/fn/article-controller/approve-article';

@Component({
  selector: 'app-paper-approval-queue',
  templateUrl: './paper-approval-queue.component.html',
  styleUrls: ['./paper-approval-queue.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PaperApprovalQueueComponent implements OnInit {
  papers: PaperApproval[] = [];
  selectedPaper: PaperApproval | null = null;
  rejectionReason: string = '';

  articles: Article[] = [];
  selectedArticle: Article | null = null;


  constructor(private adminService: AdminService, private articleService: ArticleControllerService) {}

  ngOnInit(): void {
    this.loadArticles();
  }




   viewArticleDetails(article: Article): void {
    this.selectedArticle = article;
    this.rejectionReason = '';
  }









  loadArticles(): void {
    this.articleService.getAllArticles().subscribe(articles => {
      this.articles = articles;
    });
  }



  closeArticleDetails(): void {
    this.selectedArticle = null;
    this.rejectionReason = '';
  }

  approveArticle(article: Article): void {
    if (article.id === undefined) {
      console.error('Article ID is undefined');
      return;
    }
    const params: ApproveArticle$Params = { id: article.id };
    this.articleService.approveArticle(params).subscribe(() => {
      this.loadArticles();
      this.closeArticleDetails();
    });
  }

  rejectArticle(article: Article): void {
    if (this.rejectionReason) {
      article.approved = false;
      this.loadArticles();
      this.closeArticleDetails();
    }
  }

  getStatusClass(approved: boolean | undefined): string {
    if (approved === true)  return 'status-approved';
    if (approved === false) return 'status-pending';
    return 'status-pending';
  }
}


