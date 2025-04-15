import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperComment } from '../../models/paper';
import { PaperService } from '../../services/paper.service';
import { DiscussionService } from '../../../discussion-feedback/services/discussion.service';
import { Comment, CommentFilter } from '../../../discussion-feedback/models/comment.model';
import { Rating } from '../../../discussion-feedback/models/rating.model';
import { Feedback } from 'src/app/services/models/feedback';
import { FeedbackControllerService } from '../../../../services/services/feedback-controller.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';
import {Article} from "../../../../services/models/article";
import {ArticleControllerService} from "../../../../services/services/article-controller.service";
import { UpdateArticle$Params } from '../../../../services/fn/article-controller/update-article';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | undefined;
  isLoading = true;
  article!: Article;
  filePath: SafeResourceUrl | null = null;
  isEditing = false;
  editedArticle: any = {};
  showDeleteConfirmation = false;
  // New Discussion & Feedback properties
  paperRating: Rating | undefined;
  paperComments: Comment[] = [];
  paperFeedbacks: Feedback[] = [];
  newRating = 0;
  isRatingSubmitted = false;
  isLoadingComments = false;
  isSubmittingComment = false;
  commentSortBy: 'newest' | 'oldest' | 'popular' = 'newest';
  
  // Current user has already submitted feedback
  hasSubmittedFeedback = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private discussionService: DiscussionService,
    private feedbackService: FeedbackControllerService,
    private titleService: Title,
    private keycloakService: KeycloakService,    
    private articleService: ArticleControllerService,
    private sanitizer: DomSanitizer,

  ) { }

  ngOnInit(): void {
    this.loadPaper();
  
  }
 /* onPdfFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdfFile = file;
      this.previewPdf(file);
    }
  }*/
 
  onPdfFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdfFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
  pdfPreviewUrl: SafeResourceUrl | null = null;
selectedPdfFile: File | null = null;

  clearPdfSelection(): void {
    this.selectedPdfFile = null;
    this.pdfPreviewUrl = null;
  }
  
  getSafePdfUrl(fullPath: string): SafeResourceUrl {
    const fileName = fullPath.split(/[\\/]/).pop() || '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
        `assets/uploads/${fileName}`
    );
}
getSafePdfUrlOrDefault(): SafeResourceUrl {
  return this.article?.filePath 
      ? this.getSafePdfUrl(this.article.filePath)
      : this.sanitizer.bypassSecurityTrustResourceUrl('');
}
  getFileName(fullPath: string): string {
    // Handle both Unix (/) and Windows (\) paths
    return fullPath.split(/[\\/]/).pop() || ''; // Returns "ACP.pdf"
  }
  previewPdf(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
     // this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result);
      // Assuming your backend is running on http://localhost:8080
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:8088/uploads/${this.article.filePath}`
);
    };
    reader.readAsDataURL(file);
  }
  
  loadPaper(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.navigateToList();
      return;
    }

    this.isLoading = true;
    this.articleService.getArticleById({ id }).subscribe({
      next: (article: Article) => {
        this.article = article;
        if (article.filePath) {
          this.filePath = this.sanitizer.bypassSecurityTrustResourceUrl(article.filePath);
         
         
        }
        this.isLoading = false;

        // Always reload comments when paper is loaded
        if (article?.id) {
          const paperId = article.id.toString();
          this.loadCommentsAndFeedbacks(paperId, { sortBy: this.commentSortBy });

          // Update the page title
          document.title = `${article.title} | Academia Network`;
        }
      },
      error: (error) => {
        console.error('Error loading paper:', error);
        this.isLoading = false;
        this.isLoadingComments = false;

        if (error.status === 404) {
          this.router.navigate(['/not-found']);
        } else {
        this.navigateToList();
        }
      }
    });
  }
  startEditing(): void {
    this.isEditing = true;
    this.editedArticle = {
      title: this.article.title || '',
      abstract_: this.article.abstract_ || '',
      isbn: this.article.isbn || '',
      articleCover: this.article.articleCover || '',
      authorAffiliation: this.article.authorAffiliation || '',
      affiliation: this.article.affiliation || ''
    };
  }
  previewCoverImage(): string {
    return this.isEditing && this.editedArticle.articleCover 
      ? this.editedArticle.articleCover 
      : this.article?.articleCover || '';
  }
  selectedFile: File | null = null;
  saveChanges(): void {
    const updateParams: UpdateArticle$Params = {
      id: this.article.id!,
      title: this.editedArticle.title,
      abstract_: this.editedArticle.abstract_,
      isbn: this.editedArticle.isbn,
      authorAffiliation: this.editedArticle.authorAffiliation,
      affiliation: this.editedArticle.affiliation,
      coverImage: this.editedArticle.articleCover || '',
      domainName: this.article.domain?.name || '',
      body: { 
        file: this.selectedFile !== null ? this.selectedFile : undefined  }
    };

    this.articleService.updateArticle(updateParams).subscribe({
      next: (updatedArticle) => {
        this.article = { ...this.article, ...updatedArticle };
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }
 
  /*previewPdf(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        e.target.result
      );
    };
    reader.readAsDataURL(file);
  }
*/
 


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        
        this.selectedFile = null;
      } else {
        
        this.selectedFile = file;
      }
    }
  }
  cancelEdit(): void {
    this.isEditing = false;
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

    // Load both comments and feedbacks
    this.loadCommentsAndFeedbacks(paperId);
  }
  @ViewChild('pdfInput') pdfInput!: ElementRef;
  // Helper method to get feedbacks for an article and handle pagination
  getArticleFeedbacks(articleId: number) {
    return this.feedbackService.getFeedbacksByArticleId({ articleId }).pipe(
      map(page => page.content || [])
    );
  }

  loadCommentsAndFeedbacks(paperId: string, filter?: CommentFilter): void {
    this.isLoadingComments = true;

    // Load only feedbacks from the API - no need for mock comments
    this.getArticleFeedbacks(Number(paperId)).pipe(
      catchError(error => {
        console.error('Error loading feedbacks:', error);
        return of([]);
      })
    ).subscribe(feedbacks => {
      // Store original feedbacks
      this.paperFeedbacks = feedbacks || [];

      // Check if current user has already submitted feedback
      this.checkCurrentUserFeedback();

      // Create a Set to track unique feedback IDs to prevent duplicates
      const uniqueFeedbackIds = new Set<string>();

      // Convert feedbacks to comment format for display
      this.paperComments = (feedbacks || [])
        .filter(feedback => {
          // Generate a unique key for this feedback
          const feedbackKey = `${feedback.id}-${feedback.creatorFullName || feedback.createdBy}-${feedback.createdDate}`;

          // Only include this feedback if we haven't seen it before
          if (uniqueFeedbackIds.has(feedbackKey)) {
            return false;
          }

          // Add this feedback to our set of seen IDs
          uniqueFeedbackIds.add(feedbackKey);
          return true;
        })
        .map(feedback => {
          // Store the rating separately in the rating property instead of in content text
          let content = '';
          if (feedback.comment && feedback.comment.trim().length > 0) {
            content = feedback.comment;
          }

          return {
            id: `f-${feedback.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Ensure truly unique IDs
            authorId: feedback.createdBy || 'anonymous',
            authorName: feedback.creatorFullName || feedback.createdBy || 'Anonymous User',
            content: content,
            createdDate: feedback.createdDate || new Date().toISOString(),
            likes: 0,
            rating: feedback.note || 0 // Store rating as a separate property
          };
        });

      // Remove content duplicates (different ID but same content and author)
      this.paperComments = this.removeDuplicatesByContent(this.paperComments);

      // Sort the comments
      this.sortComments(filter);

      this.isLoadingComments = false;
    });
  }

  /**
   * Remove duplicate comments that have the same content and author
   * This helps prevent visual duplicates even if they have different IDs
   */
  private removeDuplicatesByContent(comments: Comment[]): Comment[] {
    const contentMap = new Map<string, Comment>();

    // Keep track of unique content+author combinations
    // If we find duplicates, keep the most recent one
    comments.forEach(comment => {
      const key = `${comment.authorId}-${comment.content}`;

      if (!contentMap.has(key) ||
          new Date(comment.createdDate).getTime() >
          new Date(contentMap.get(key)!.createdDate).getTime()) {
        contentMap.set(key, comment);
      }
    });

    return Array.from(contentMap.values());
  }

  sortComments(filter?: CommentFilter): void {
    const sortBy = filter?.sortBy || this.commentSortBy;

    this.paperComments.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          // Parse dates consistently, handling both string and Date objects
          const dateA = a.createdDate instanceof Date ? a.createdDate : new Date(a.createdDate);
          const dateB = b.createdDate instanceof Date ? b.createdDate : new Date(b.createdDate);
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          // Parse dates consistently, handling both string and Date objects
          const dateAOld = a.createdDate instanceof Date ? a.createdDate : new Date(a.createdDate);
          const dateBOld = b.createdDate instanceof Date ? b.createdDate : new Date(b.createdDate);
          return dateAOld.getTime() - dateBOld.getTime();
        case 'popular':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
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
      error: (err) => {
        console.error('Update failed:', err);
      }
    });
  }

  submitComment(comment: Omit<Comment, 'id' | 'createdDate'>): void {
    if (!this.paper) return;

    this.isSubmittingComment = true;
    this.discussionService.addComment(this.paper.id!.toString(), comment).subscribe({
      next: () => {
        // Reload comments to get the updated list
        this.loadCommentsAndFeedbacks(this.paper!.id!.toString(), { sortBy: this.commentSortBy });
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
    this.loadCommentsAndFeedbacks(this.paper.id!.toString(), filter);
  }
  confirmDelete(): void {
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  deletePaper(): void {
    if (!this.article) return;

    this.articleService.archiveArticle({ id: this.article.id! }).subscribe({
      next: (success) => {
        if (success) {
          this.showDeleteConfirmation = false;
          document.body.style.overflow = ''; // Restore scrolling
          this.navigateToList(); // Redirect to list after archiving
        } else {
          this.showDeleteConfirmation = false;
          document.body.style.overflow = ''; // Restore scrolling
        }
      },
      error: (error) => {
        console.error('Error archiving paper:', error);
        this.showDeleteConfirmation = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    });
  }

  onFeedbackSubmitted(feedback: Feedback): void {
    if (!this.paper?.id) return;

    console.log('Feedback being submitted:', feedback);

    // Create API-compatible feedback object
    const feedbackRequest = {
      comment: feedback.comment,
      note: feedback.note
    };

    // Show loading state while submitting
    this.isLoadingComments = true;

    this.feedbackService.createFeedback({
      articleId: this.paper.id,
      body: feedbackRequest
    }).subscribe({
      next: (createdFeedback) => {
        console.log('Feedback submitted successfully:', createdFeedback);

        // Refresh data
        this.isRatingSubmitted = true;

        // Reload comments to get fresh data without reloading the entire paper
        this.loadCommentsAndFeedbacks(this.paper!.id!.toString(), { sortBy: this.commentSortBy });
      },
      error: (err) => {
        console.error('Error archiving paper:', err);
      }
    });
  }

  /**
   * Get the current authenticated user's ID from Keycloak
   * This returns the user's subject ID which is a UUID
   */
  private getCurrentUserId(): string | undefined {
    // Access the tokenParsed.sub property which contains the user's UUID
    return this.keycloakService.keycloak.tokenParsed?.sub;
  }

  /**
   * Check if the current authenticated user has already submitted feedback for this article
   */
  private checkCurrentUserFeedback(): void {
    const currentUserId = this.getCurrentUserId();
    console.log('Current user ID:', currentUserId);

    if (currentUserId && this.paperFeedbacks.length > 0) {
      // Log feedback creator IDs for debugging
      this.paperFeedbacks.forEach(feedback => {
        console.log('Feedback created by:', feedback.createdBy);
      });

      // Check if current user's ID matches any feedback creator ID
      this.hasSubmittedFeedback = this.paperFeedbacks.some(feedback =>
        feedback.createdBy === currentUserId
      );

      console.log('Current user has submitted feedback:', this.hasSubmittedFeedback);
  }
}

  /**
   * Returns true if the current user has already submitted feedback for this article
   */
  hasUserAlreadySubmittedFeedback(): boolean {
    return this.hasSubmittedFeedback;
  }
}
