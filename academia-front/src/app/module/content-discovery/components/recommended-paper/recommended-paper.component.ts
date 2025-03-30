import { Component, Input } from '@angular/core';
import { Paper } from '../../../paper/models/paper';

@Component({
  selector: 'app-recommended-paper',
  templateUrl: './recommended-paper.component.html',
  styleUrls: ['./recommended-paper.component.scss']
})
export class RecommendedPaperComponent {
  @Input() paper!: Paper;
  
  getRatingStars(): number[] {
    if (!this.paper.rating) return [0, 0, 0, 0, 0];
    
    const fullStars = Math.floor(this.paper.rating);
    const hasHalfStar = this.paper.rating - fullStars >= 0.5;
    
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