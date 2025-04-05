import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperComment } from '../../models/paper';
import { PaperService } from '../../services/paper.service';
import { DiscussionService } from '../../../discussion-feedback/services/discussion.service';
import { Comment, CommentFilter } from '../../../discussion-feedback/models/comment.model';
import { Rating } from '../../../discussion-feedback/models/rating.model';
import { Feedback } from 'src/app/services/models/feedback';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | undefined;
  loading = true;
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
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService,
    private discussionService: DiscussionService
  ) { }

  ngOnInit(): void {
    this.loadPaper();
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
        this.loadComments(this.paper!.id!.toString(), { sortBy: this.commentSortBy });
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

  confirmDelete(): void {
    console.log('Confirm delete called, showing modal');
    this.showDeleteConfirmation = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  deletePaper(): void {
    if (!this.paper) return;
    
    this.paperService.deletePaper(this.paper.id!).subscribe({
      next: (success) => {
        if (success) {
          this.showDeleteConfirmation = false;
          document.body.style.overflow = ''; // Restore scrolling
          this.navigateToList();
        } else {
          this.showDeleteConfirmation = false;
          document.body.style.overflow = ''; // Restore scrolling
        }
      },
      error: (error) => {
        console.error('Error deleting paper:', error);
        this.showDeleteConfirmation = false;
        document.body.style.overflow = ''; // Restore scrolling
      }
    });
  }

  onFeedbackSubmitted(feedback: Feedback): void {
    // Refresh feedback ratings or display success message
    console.log('Feedback submitted:', feedback);
    
    // You could show a notification
    this.isRatingSubmitted = true;
    
    // Optionally refresh paper data to show updated ratings
    setTimeout(() => {
      this.loadPaper();
    }, 1000);
  }
}
