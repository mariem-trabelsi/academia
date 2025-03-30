import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Researcher } from '../../models/social';

@Component({
  selector: 'app-researcher-card',
  templateUrl: './researcher-card.component.html',
  styleUrls: ['./researcher-card.component.scss']
})
export class ResearcherCardComponent {
  @Input() researcher!: Researcher;
  @Output() view = new EventEmitter<void>();
  @Output() follow = new EventEmitter<void>();
  
  constructor() { }
  
  onView(): void {
    this.view.emit();
  }
  
  onFollow(event: Event): void {
    event.stopPropagation();
    this.follow.emit();
  }
  
  formatFollowerCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
} 