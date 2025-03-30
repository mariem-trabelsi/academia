import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper, PaperComment } from '../../models/paper';
import { PaperService } from '../../services/paper.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {
  paper: Paper | undefined;
  loading = true;
  newComment = '';
  newRating = 0;
  isRatingSubmitted = false;
  showDeleteConfirmation = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paperService: PaperService
  ) { }

  ngOnInit(): void {
    this.loadPaper();
  }

  loadPaper(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.navigateToList();
      return;
    }
    
    this.paperService.getPaperById(id).subscribe({
      next: (paper) => {
        this.paper = paper;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading paper:', error);
        this.loading = false;
        this.navigateToList();
      }
    });
  }

  navigateToList(): void {
    this.router.navigate(['/papers']);
  }

  getRatingStars(rating: number = 0, interactive = false): number[] {
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

  submitComment(): void {
    if (!this.paper || !this.newComment.trim()) return;
    
    const comment: Omit<PaperComment, 'id' | 'createdDate'> = {
      authorName: 'Current User',
      authorId: 'currentUser123',
      content: this.newComment.trim()
    };
    
    this.paperService.addComment(this.paper.id!, comment).subscribe({
      next: (newComment) => {
        if (!this.paper!.comments) {
          this.paper!.comments = [];
        }
        this.paper!.comments.push(newComment);
        this.newComment = '';
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  submitRating(): void {
    if (!this.paper || this.newRating === 0 || this.isRatingSubmitted) return;
    
    this.paperService.ratePaper(this.paper.id!, this.newRating).subscribe({
      next: (updatedPaper) => {
        this.paper!.rating = updatedPaper.rating;
        this.paper!.ratingCount = updatedPaper.ratingCount;
        this.isRatingSubmitted = true;
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
      }
    });
  }

  setRating(rating: number): void {
    if (!this.isRatingSubmitted) {
      this.newRating = rating;
    }
  }

  editPaper(): void {
    if (this.paper) {
      this.router.navigate(['/papers/edit', this.paper.id]);
    }
  }

  confirmDelete(): void {
    console.log('Confirm delete called, showing modal');
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  deletePaper(): void {
    if (!this.paper) return;
    
    this.paperService.deletePaper(this.paper.id!).subscribe({
      next: (success) => {
        if (success) {
          this.navigateToList();
        } else {
          this.showDeleteConfirmation = false;
        }
      },
      error: (error) => {
        console.error('Error deleting paper:', error);
        this.showDeleteConfirmation = false;
      }
    });
  }
}
