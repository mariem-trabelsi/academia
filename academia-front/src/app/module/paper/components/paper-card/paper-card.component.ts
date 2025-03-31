import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Paper } from '../../models/paper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paper-card',
  templateUrl: './paper-card.component.html',
  styleUrls: ['./paper-card.component.scss']
})
export class PaperCardComponent {
  @Input() paper!: Paper;
  @Output() deleteRequest = new EventEmitter<number>();

  constructor(private router: Router) {}

  viewPaper(): void {
    this.router.navigate(['/papers', this.paper.id]);
  }

  editPaper(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/papers/edit', this.paper.id]);
  }

  deletePaper(event: Event): void {
    event.stopPropagation();
    this.deleteRequest.emit(this.paper.id);
  }

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
