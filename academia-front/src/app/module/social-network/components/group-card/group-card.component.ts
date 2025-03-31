import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ResearchGroup } from '../../models/social';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent {
  @Input() group!: ResearchGroup;
  @Output() join = new EventEmitter<void>();
  @Output() view = new EventEmitter<void>();
  
  constructor() { }
  
  onJoin(event: Event): void {
    event.stopPropagation();
    this.join.emit();
  }
  
  onView(): void {
    this.view.emit();
  }
  
  formatMemberCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
  
  getTopFocus(): string[] {
    return this.group.researchFocus?.slice(0, 2) || [];
  }
} 