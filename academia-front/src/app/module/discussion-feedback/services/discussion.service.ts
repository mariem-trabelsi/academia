import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Comment, CommentFilter } from '../models/comment.model';
import { Rating, RatingDistribution } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  
  private mockComments: Map<string, Comment[]> = new Map();
  private mockRatings: Map<string, Rating> = new Map();
  
  constructor() {
    this.initializeMockData();
  }
  
  private initializeMockData(): void {
    // Initialize mock comments for a sample article
    this.mockComments.set('article-1', [
      {
        id: '1',
        authorId: 'user-123',
        authorName: 'Dr. Emily Chen',
        authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        content: 'This article provides valuable insights into quantum computing. I particularly appreciated the discussion of error correction techniques.',
        createdDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        likes: 12
      },
      {
        id: '2',
        authorId: 'user-456',
        authorName: 'Prof. Mark Johnson',
        authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'While I agree with the overall assessment, I think the paper could benefit from a more detailed discussion of current hardware limitations.',
        createdDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        likes: 5
      },
      {
        id: '3',
        authorId: 'user-789',
        authorName: 'Sarah Miller',
        content: 'As a newcomer to this field, I found this article to be accessible yet comprehensive. The diagrams were particularly helpful.',
        createdDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        likes: 8
      }
    ]);
    
    // Initialize mock ratings for a sample article
    this.mockRatings.set('article-1', {
      value: 0, // Current user's rating (0 means not rated)
      average: 4.2,
      count: 45,
      distribution: {
        1: 2,
        2: 3,
        3: 8,
        4: 12,
        5: 20
      }
    });
  }
  
  getComments(contentId: string, filter?: CommentFilter): Observable<Comment[]> {
    let comments = this.mockComments.get(contentId) || [];
    
    if (filter) {
      // Apply sorting
      if (filter.sortBy) {
        comments = [...comments].sort((a, b) => {
          switch (filter.sortBy) {
            case 'newest':
              return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            case 'oldest':
              return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
            case 'popular':
              return (b.likes || 0) - (a.likes || 0);
            default:
              return 0;
          }
        });
      }
      
      // Filter out replies if needed
      if (filter.showReplies === false) {
        comments = comments.filter(comment => !comment.parentId);
      }
    }
    
    return of(comments).pipe(delay(300));
  }
  
  addComment(contentId: string, comment: Omit<Comment, 'id' | 'createdDate'>): Observable<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.generateId(),
      createdDate: new Date().toISOString(),
      likes: 0
    };
    
    if (!this.mockComments.has(contentId)) {
      this.mockComments.set(contentId, []);
    }
    
    this.mockComments.get(contentId)!.push(newComment);
    return of(newComment).pipe(delay(500));
  }
  
  getRating(contentId: string): Observable<Rating> {
    return of(this.mockRatings.get(contentId) || {
      value: 0,
      average: 0,
      count: 0
    }).pipe(delay(300));
  }
  
  submitRating(contentId: string, value: number): Observable<Rating> {
    // Get existing rating or create new one
    const rating = this.mockRatings.get(contentId) || {
      value: 0,
      average: 0,
      count: 0,
      distribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      }
    };
    
    const oldValue = rating.value;
    const distribution = rating.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    // Update distribution and count if it's a new rating
    if (oldValue === 0) {
      rating.count++;
      distribution[value as keyof RatingDistribution]++;
    } else {
      // Remove old rating from distribution and add new one
      distribution[oldValue as keyof RatingDistribution]--;
      distribution[value as keyof RatingDistribution]++;
    }
    
    // Calculate new average
    let sum = 0;
    let total = 0;
    for (let i = 1; i <= 5; i++) {
      sum += i * distribution[i as keyof RatingDistribution];
      total += distribution[i as keyof RatingDistribution];
    }
    
    rating.average = total > 0 ? sum / total : 0;
    rating.value = value;
    rating.distribution = distribution;
    
    this.mockRatings.set(contentId, rating);
    return of(rating).pipe(delay(500));
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
} 