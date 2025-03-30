import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Comment } from '../../models/comment.model';

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
  @Input() parentId?: string | number;
  @Input() placeholder: string = 'Add your comment...';
  @Input() buttonText: string = 'Submit Comment';
  @Input() minLength: number = 3;
  @Input() maxLength: number = 1000;
  @Input() isSubmitting: boolean = false;
  
  @Output() commentSubmit = new EventEmitter<Omit<Comment, 'id' | 'createdDate'>>();
  
  commentContent: string = '';
  
  submitComment(): void {
    if (this.isCommentValid() && !this.isSubmitting) {
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
  
  onKeyDown(event: KeyboardEvent): void {
    // Check if the key pressed is Enter and Ctrl is also pressed
    if (event.key === 'Enter' && event.ctrlKey) {
      this.submitComment();
      event.preventDefault();
    }
  }
  
  isCommentValid(): boolean {
    return this.commentContent.trim().length >= this.minLength && 
           this.commentContent.length <= this.maxLength;
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