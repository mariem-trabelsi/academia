import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Paper, PaperDomain } from '../../paper/models/paper';
import { DiscoveryData, TopicFilter } from '../models/discovery';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {
  private apiUrl = '/api/discovery'; // Will be replaced with actual backend URL

  // Mock cover images for papers
  private mockCoverImages = [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Scientific paper cover
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Biology
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Physics
    'https://images.unsplash.com/photo-1584277261846-c6a1672ed979?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Medicine
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Math
    'https://images.unsplash.com/photo-1581093196277-9f608bb3c539?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Computer Science
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Economics
    'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Engineering
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Psychology
    'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Chemistry
  ];

  constructor(private http: HttpClient) { }

  // Get recommended papers based on user's interests and history
  getRecommendedPapers(): Observable<Paper[]> {
    // For now, we'll use mock data until backend is implemented
    return of(this.getMockPapers(5));
  }

  // Get trending papers across the platform or in specific domain
  getTrendingPapers(domain?: string): Observable<Paper[]> {
    // For now, we'll use mock data until backend is implemented
    return of(this.getMockPapers(5));
  }

  // Get latest papers based on filters
  getLatestPapers(filter: TopicFilter): Observable<Paper[]> {
    // For now, we'll use mock data until backend is implemented
    return of(this.getMockPapers(10));
  }

  // Get all discovery data in one call
  getDiscoveryData(filter: TopicFilter): Observable<DiscoveryData> {
    // For now, we'll use mock data until backend is implemented
    return of({
      recommendedPapers: this.getMockPapers(4),
      trendingPapers: this.getMockPapers(5),
      latestPapers: this.getMockPapers(8),
      relatedPapers: this.getMockPapers(6)
    });
  }

  // Get available keywords for filtering
  getPopularKeywords(): Observable<string[]> {
    return of([
      'Machine Learning', 'Quantum Physics', 'Climate Change', 
      'Neuroscience', 'Artificial Intelligence', 'Genomics', 
      'Blockchain', 'Psychology', 'Renewable Energy', 'Nanotechnology'
    ]);
  }

  // Mock data generator (temporary until backend is connected)
  private getMockPapers(count: number): Paper[] {
    const papers: Paper[] = [];
    const domains = Object.values(PaperDomain);
    
    for (let i = 0; i < count; i++) {
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const randomRating = Math.round((Math.random() * 5) * 10) / 10;
      const randomImageIndex = Math.floor(Math.random() * this.mockCoverImages.length);
      
      papers.push({
        id: i + 1,
        title: `Research Paper on ${randomDomain} - ${i + 1}`,
        abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl vitae aliquam ultricies, nunc nunc tincidunt nunc, vitae aliquam nisl nisl vitae nisl.',
        content: '',
        authorName: `Author ${i + 1}`,
        domain: randomDomain,
        keywords: ['keyword1', 'keyword2'],
        createdDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        rating: randomRating,
        ratingCount: Math.floor(Math.random() * 100),
        coverImage: this.mockCoverImages[randomImageIndex]
      });
    }
    
    return papers;
  }
} 