import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperComment } from '../../models/paper';
import { PaperService } from '../../services/paper.service';
import { DiscussionService } from '../../../discussion-feedback/services/discussion.service';
import { Comment, CommentFilter } from '../../../discussion-feedback/models/comment.model';
import { Rating } from '../../../discussion-feedback/models/rating.model';
import {ArticleControllerService} from "../../../../services/services/article-controller.service";
import {Article} from "../../../../services/models/article";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | undefined;
  article: Article | undefined;
  loading = true;
  filePath: SafeResourceUrl | undefined;
  showDeleteConfirmation = false;

  // New Discussion & Feedback properties
  paperRating: Rating | undefined;
  paperComments: Comment[] = [];
  newRating = 0;
  isRatingSubmitted = false;
  isLoadingComments = false;
  isSubmittingComment = false;
  commentSortBy: 'newest' | 'oldest' | 'popular' = 'newest';

  constructor(
    private articleService: ArticleControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private sanitizer: DomSanitizer,
    private discussionService: DiscussionService
  ) {
  }

  ngOnInit(): void {

    this.loadArticle();
  }

  // Load article details based on the ID from the route
  loadArticle(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      console.error('Invalid article ID');
      this.navigateToList();
      return;
    }
    this.loading = true;
    this.articleService.getArticleById({ id: id }).subscribe({
      next: (article: Article) => {
        this.article = article;
        const filePath = 'assets/ACP.pdf';
        this.filePath = this.sanitizer.bypassSecurityTrustResourceUrl(filePath);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading article:', error);
        this.loading = false;
      }
    });
  }

// Confirm delete for article
  confirmDelete(): void {
    console.log('Confirm delete called, showing modal');
    this.showDeleteConfirmation = true;
    document.body.style.overflow = 'hidden';
  }

// Cancel the delete action
  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    document.body.style.overflow = '';
  }

// Delete article
  // Delete the article by calling the service
  deleteArticle(): void {
    if (!this.article) return;

    // Call the service to delete the article by its ID
    this.articleService.deleteArticle({ id: this.article.id! }).subscribe({
      next: () => {
        this.showDeleteConfirmation = false;
        document.body.style.overflow = '';
        this.navigateToList();
      },
      error: (error) => {
        console.error('Error deleting article:', error);
        this.showDeleteConfirmation = false;
        document.body.style.overflow = '';
      }
    });
  }


  loadPaper(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.navigateToList();
      return;
    }

    this.paperService.getPaperById(id).subscribe({
      next: (paper) => {
        this.paper = paper;
        this.loading = false;

        // Load discussion data after paper loads
        if (paper?.id) {
          this.loadDiscussionData(paper.id.toString());
        }
      },
      error: (error) => {
        console.error('Error loading paper:', error);
        this.loading = false;
        this.navigateToList();
      }
    });
  }

  loadDiscussionData(paperId: string): void {
    // Load rating data
    this.discussionService.getRating(paperId).subscribe({
      next: (rating) => {
        this.paperRating = rating;
        this.newRating = rating.value;
        this.isRatingSubmitted = rating.value > 0;
      }
    });

    // Load comments
    this.loadComments(paperId);
  }

  loadComments(paperId: string, filter?: CommentFilter): void {
    this.isLoadingComments = true;

    this.discussionService.getComments(paperId, filter).subscribe({
      next: (comments) => {
        this.paperComments = comments;
        this.isLoadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.isLoadingComments = false;
      }
    });
  }

  navigateToList(): void {
    this.router.navigate(['/discover']);
  }

  setRating(rating: number): void {
    this.newRating = rating;
  }

  submitRating(): void {
    if (!this.paper || this.newRating === 0 || this.isRatingSubmitted) return;

    this.discussionService.submitRating(this.paper.id!.toString(), this.newRating).subscribe({
      next: (updatedRating) => {
        this.paperRating = updatedRating;
        this.isRatingSubmitted = true;
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
      }
    });
  }

  submitComment(comment: Omit<Comment, 'id' | 'createdDate'>): void {
    if (!this.paper) return;

    this.isSubmittingComment = true;
    this.discussionService.addComment(this.paper.id!.toString(), comment).subscribe({
      next: () => {
        // Reload comments to get the updated list
        this.loadComments(this.paper!.id!.toString(), {sortBy: this.commentSortBy});
        this.isSubmittingComment = false;
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.isSubmittingComment = false;
      }
    });
  }

  onCommentSortChange(filter: CommentFilter): void {
    if (!this.paper) return;
    this.commentSortBy = filter.sortBy || 'newest';
    this.loadComments(this.paper.id!.toString(), filter);
  }

  editPaper(): void {
    if (this.paper) {
      this.router.navigate(['/papers/edit', this.paper.id]);
    }
  }

}
