import { Component, EventEmitter, Input, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Comment, CommentFilter } from '../../models/comment.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  animations: [
    trigger('commentAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CommentListComponent {
  @Input() comments: Comment[] = [];
  @Input() loading: boolean = false;
  @Input() sortBy: 'newest' | 'oldest' | 'popular' = 'newest';
  
  @Output() sortChange = new EventEmitter<CommentFilter>();
  @Output() replyClick = new EventEmitter<Comment>();
  
  showSortOptions: boolean = false;
  
  changeSortOption(option: 'newest' | 'oldest' | 'popular'): void {
    this.sortBy = option;
    this.showSortOptions = false;
    this.sortChange.emit({ sortBy: option });
  }
  
  toggleSortOptions(): void {
    this.showSortOptions = !this.showSortOptions;
  }
  
  getRelativeTime(dateStr: string | Date): string {
    // Safely parse the date - handle both Date objects and strings
    let date: Date;
    
    try {
      date = dateStr instanceof Date ? dateStr : new Date(dateStr);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
    } catch (e) {
      console.error('Error parsing date:', e);
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  handleReply(comment: Comment): void {
    this.replyClick.emit(comment);
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  
  getAvatarColor(name: string): string {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#6366F1', // Indigo
      '#F97316', // Orange
      '#14B8A6'  // Teal
    ];
    
    if (!name) return colors[0];
    
    // Simple hash function to get a consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a consistent index from the hash
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
  
  /**
   * Track comments by their ID for ngFor optimization
   * This helps Angular identify which items have changed and need to be re-rendered
   */
  trackByCommentId(index: number, comment: Comment): string | number {
    return comment.id || index;
  }
} 