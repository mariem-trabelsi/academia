import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class NotificationItemComponent implements OnInit {
  @Input() notification!: Notification;
  @Output() markAsRead = new EventEmitter<string>();
  
  imageLoadError = false;

  // Consistent, complementary avatar colors
  private avatarColors = [
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

  ngOnInit(): void {
    // Pre-check if avatar exists to avoid image twitching
    if (!this.notification.sender?.avatar) {
      this.imageLoadError = true;
    }
  }

  handleMarkAsRead(event: Event): void {
    event.stopPropagation();
    this.markAsRead.emit(this.notification.id);
  }

  handleImageError(event: Event): void {
    this.imageLoadError = true;
    // No need to set src, we'll use the fallback display instead
  }

  /**
   * Returns the initials (first letters of first and last name)
   */
  getInitials(name: string): string {
    if (!name) return '';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Generates a consistent color based on the user's name
   */
  getAvatarColor(name: string): string {
    if (!name) return this.avatarColors[0];
    
    // Simple hash function to get a consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Get a consistent index from the hash
    const index = Math.abs(hash) % this.avatarColors.length;
    return this.avatarColors[index];
  }

  getTimeAgo(date: Date): string {
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

  getIconForType(type: string): string {
    switch (type) {
      case 'paper_citation':
        return 'fas fa-quote-right';
      case 'new_follower':
        return 'fas fa-user-plus';
      case 'comment':
        return 'fas fa-comment';
      case 'new_paper':
        return 'fas fa-file-alt';
      case 'mention':
        return 'fas fa-at';
      case 'collaboration_invite':
        return 'fas fa-users';
      case 'message':
        return 'fas fa-envelope';
      default:
        return 'fas fa-bell';
    }
  }

  getIconColorClass(type: string): string {
    switch (type) {
      case 'paper_citation':
        return 'citation-icon';
      case 'new_follower':
        return 'follower-icon';
      case 'comment':
        return 'comment-icon';
      case 'new_paper':
        return 'paper-icon';
      case 'mention':
        return 'mention-icon';
      case 'collaboration_invite':
        return 'collaboration-icon';
      case 'message':
        return 'message-icon';
      default:
        return '';
    }
  }
} 