import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Comment } from '../../models/comment.model';
import { Feedback } from 'src/app/services/models/feedback';
import { FeedbackControllerService } from 'src/app/services/services/feedback-controller.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss'],
  animations: [
    trigger('formAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CommentFormComponent {
  @Input() contentId!: string;
  @Input() articleId?: number;
  @Input() parentId?: string | number;
  @Input() placeholder: string = 'Add your comment...';
  @Input() buttonText: string = 'Submit Comment';
  @Input() minLength: number = 3;
  @Input() maxLength: number = 1000;
  @Input() isSubmitting: boolean = false;
  @Input() isFeedback: boolean = false;
  
  @Output() commentSubmit = new EventEmitter<Omit<Comment, 'id' | 'createdDate'>>();
  @Output() feedbackSubmit = new EventEmitter<Feedback>();
  
  commentContent: string = '';
  rating: number = 0;
  
  constructor(private feedbackService: FeedbackControllerService) {}
  
  submitComment(): void {
    if (this.isCommentValid() && !this.isSubmitting) {
      if (this.isFeedback && this.articleId) {
        this.submitFeedback();
      } else {
        const comment: Omit<Comment, 'id' | 'createdDate'> = {
          authorId: 'current-user', // In a real app, get from auth service
          authorName: 'Current User', // In a real app, get from user profile
          content: this.commentContent.trim(),
          parentId: this.parentId
        };
        
        this.commentSubmit.emit(comment);
        this.commentContent = '';
      }
    }
  }
  
  submitFeedback(): void {
    if (this.isCommentValid() && this.rating > 0 && this.articleId && !this.isSubmitting) {
      const feedback: Feedback = {
        comment: this.commentContent.trim(),
        note: this.rating
      };
      
      this.feedbackService.createFeedback({
        articleId: this.articleId,
        body: feedback
      }).subscribe({
        next: (createdFeedback) => {
          this.feedbackSubmit.emit(createdFeedback);
          this.commentContent = '';
          this.rating = 0;
        },
        error: (error) => {
          console.error('Error creating feedback:', error);
        }
      });
    }
  }
  
  setRating(value: number): void {
    this.rating = value;
  }
  
  onKeyDown(event: KeyboardEvent): void {
    // Check if the key pressed is Enter and Ctrl is also pressed
    if (event.key === 'Enter' && event.ctrlKey) {
      this.submitComment();
      event.preventDefault();
    }
  }
  
  isCommentValid(): boolean {
    return this.commentContent.trim().length >= this.minLength && 
           this.commentContent.length <= this.maxLength &&
           (!this.isFeedback || this.rating > 0);
  }
  
  getRemainingChars(): number {
    return this.maxLength - this.commentContent.length;
  }
  
  getCharCountClass(): string {
    const remaining = this.getRemainingChars();
    if (remaining <= 10) {
      return 'critical';
    } else if (remaining <= 50) {
      return 'warning';
    }
    return '';
  }
} 