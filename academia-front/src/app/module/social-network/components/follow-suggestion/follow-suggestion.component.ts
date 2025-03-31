import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Researcher } from '../../models/social';

@Component({
  selector: 'app-follow-suggestion',
  templateUrl: './follow-suggestion.component.html',
  styleUrls: ['./follow-suggestion.component.scss']
})
export class FollowSuggestionComponent {
  @Input() researcher!: Researcher;
  @Output() follow = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();
  @Output() message = new EventEmitter<void>();
  
  constructor() { }
  
  onFollow(event: Event): void {
    event.stopPropagation();
    this.follow.emit();
  }
  
  onView(): void {
    this.view.emit();
  }
  
  onMessage(event: Event): void {
    event.stopPropagation();
    this.message.emit();
  }
  
  getTopInterests(): string[] {
    return this.researcher.researchInterests.slice(0, 2);
  }
} 