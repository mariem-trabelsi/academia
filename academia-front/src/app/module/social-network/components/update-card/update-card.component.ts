import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ResearchUpdate, UpdateType } from '../../services/social.service';

@Component({
  selector: 'app-update-card',
  templateUrl: './update-card.component.html',
  styleUrls: ['./update-card.component.scss']
})
export class UpdateCardComponent {
  @Input() update!: ResearchUpdate;
  @Output() like = new EventEmitter<void>();
  @Output() comment = new EventEmitter<void>();
  @Output() viewResearcher = new EventEmitter<void>();
  @Output() viewPaper = new EventEmitter<number>();
  
  UpdateType = UpdateType; // To use in template
  
  constructor() { }
  
  onLike(): void {
    this.like.emit();
  }
  
  onComment(): void {
    this.comment.emit();
  }
  
  onViewResearcher(event: Event): void {
    event.stopPropagation();
    this.viewResearcher.emit();
  }
  
  onViewPaper(event: Event): void {
    event.stopPropagation();
    if (this.update.paperId) {
      this.viewPaper.emit(this.update.paperId);
    }
  }
  
  getUpdateTypeIcon(): string {
    switch (this.update.updateType) {
      case UpdateType.PAPER_PUBLISHED:
        return 'fa-file-alt';
      case UpdateType.RESEARCH_UPDATE:
        return 'fa-microscope';
      case UpdateType.COLLABORATION_OPPORTUNITY:
        return 'fa-users';
      case UpdateType.CONFERENCE_ANNOUNCEMENT:
        return 'fa-calendar-alt';
      case UpdateType.QUESTION:
        return 'fa-question-circle';
      default:
        return 'fa-bell';
    }
  }
  
  getUpdateTypeLabel(): string {
    switch (this.update.updateType) {
      case UpdateType.PAPER_PUBLISHED:
        return 'Published Paper';
      case UpdateType.RESEARCH_UPDATE:
        return 'Research Update';
      case UpdateType.COLLABORATION_OPPORTUNITY:
        return 'Collaboration Opportunity';
      case UpdateType.CONFERENCE_ANNOUNCEMENT:
        return 'Conference Announcement';
      case UpdateType.QUESTION:
        return 'Question';
      default:
        return 'Update';
    }
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  handleProfileImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement.parentElement) {
      imgElement.style.display = 'none';
      imgElement.parentElement.classList.add('avatar-fallback');
    }
  }
}
