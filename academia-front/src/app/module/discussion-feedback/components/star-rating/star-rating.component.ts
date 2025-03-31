import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  animations: [
    trigger('starAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition('* => *', [
        style({ transform: 'scale(1)' }),
        animate('200ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1.2)' })),
        animate('150ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class StarRatingComponent implements OnInit {
  @Input() maxRating: number = 5;
  @Input() currentRating: number = 0;
  @Input() readOnly: boolean = false;
  @Input() showRatingValue: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() isAnimated: boolean = true;
  
  @Output() ratingChange = new EventEmitter<number>();
  
  hoverRating: number = 0;
  animationState: number = 0;
  stars: number[] = [];
  
  ngOnInit(): void {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }
  
  setRating(value: number): void {
    if (this.readOnly) return;
    
    this.currentRating = value;
    this.animationState = value; // Trigger animation
    this.ratingChange.emit(value);
  }
  
  setHoverRating(value: number): void {
    if (this.readOnly) return;
    this.hoverRating = value;
  }
  
  clearHoverRating(): void {
    if (this.readOnly) return;
    this.hoverRating = 0;
  }
  
  getStarClass(star: number): string {
    const displayRating = this.hoverRating || this.currentRating;
    
    if (displayRating >= star) {
      return 'fas fa-star';
    } else if (displayRating >= star - 0.5) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  }
  
  getValueToDisplay(): string {
    return this.currentRating.toFixed(1);
  }
} 