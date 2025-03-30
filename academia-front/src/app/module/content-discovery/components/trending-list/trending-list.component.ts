import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Paper } from '../../../paper/models/paper';

@Component({
  selector: 'app-trending-list',
  templateUrl: './trending-list.component.html',
  styleUrls: ['./trending-list.component.scss']
})
export class TrendingListComponent {
  @Input() papers: Paper[] = [];
  @Output() paperClick = new EventEmitter<number>();
  
  viewPaper(id: number | undefined): void {
    if (id !== undefined) {
      this.paperClick.emit(id);
    }
  }
  
  getRatingStars(rating: number | undefined): number[] {
    if (!rating) return [0, 0, 0, 0, 0];
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    const stars = [];
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    // Fill the rest with empty stars
    while (stars.length < 5) {
      stars.push(0);
    }
    
    return stars;
  }
} 