import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rating } from '../../models/rating.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss'],
  animations: [
    trigger('barAnimation', [
      transition(':enter', [
        style({ width: 0 }),
        animate('600ms ease-out', style({ width: '*' }))
      ])
    ])
  ]
})
export class RatingSummaryComponent implements OnChanges {
  @Input() rating!: Rating;
  
  ratingLabels: string[] = [
    'Poor',        // 1 star
    'Fair',        // 2 stars
    'Good',        // 3 stars
    'Very Good',   // 4 stars
    'Excellent'    // 5 stars
  ];
  
  ratingCountBars: {value: number, percentage: number, count: number}[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rating'] && this.rating?.distribution) {
      this.calculateRatingBars();
    }
  }
  
  private calculateRatingBars(): void {
    if (!this.rating.distribution) return;
    
    const totalRatings = this.rating.count;
    this.ratingCountBars = [];
    
    for (let i = 5; i >= 1; i--) {
      const count = this.rating.distribution[i as keyof typeof this.rating.distribution] || 0;
      const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
      
      this.ratingCountBars.push({
        value: i,
        percentage,
        count
      });
    }
  }
  
  getNumberOfFullStars(value: number): number[] {
    return Array(value).fill(0);
  }
} 