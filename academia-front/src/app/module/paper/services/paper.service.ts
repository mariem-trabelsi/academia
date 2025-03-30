import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Paper, PaperAttachment, PaperComment, PaperDomain, PaperFilter } from '../models/paper';

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  private mockPapers: Paper[] = [
    {
      id: 1,
      title: 'Advances in Quantum Computing: A Comprehensive Review',
      abstract: 'This paper provides a comprehensive review of recent advances in quantum computing, focusing on quantum algorithms, error correction, and hardware implementations.',
      content: 'Quantum computing has emerged as a revolutionary computing paradigm that leverages quantum mechanical phenomena such as superposition and entanglement to perform computations. In recent years, significant progress has been made in both the theoretical and practical aspects of quantum computing...',
      authorName: 'Dr. Sarah Johnson',
      authorId: 'user123',
      authorAffiliation: 'MIT',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop',
      pdfUrl: 'https://example.com/quantum-computing.pdf',
      domain: PaperDomain.ComputerScience,
      keywords: ['quantum computing', 'quantum algorithms', 'qubits', 'quantum error correction'],
      createdDate: '2023-06-15T10:30:00',
      lastModifiedDate: '2023-06-20T14:45:00',
      isApproved: true,
      rating: 4.8,
      ratingCount: 24,
      comments: [
        {
          id: 1,
          authorName: 'Prof. David Miller',
          authorId: 'user456',
          content: 'Excellent review! The section on quantum error correction is particularly insightful.',
          createdDate: '2023-06-18T09:15:00'
        },
        {
          id: 2,
          authorName: 'Dr. Emily Chen',
          authorId: 'user789',
          content: 'This paper provides a great overview of recent developments in the field. I would suggest adding more information about topological quantum computing in a future revision.',
          createdDate: '2023-06-19T16:30:00'
        }
      ],
      attachments: [
        {
          id: 1,
          name: 'Supplementary Data',
          fileUrl: 'assets/mock-files/quantum-data.xlsx',
          fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          fileSize: 2048
        }
      ]
    },
    {
      id: 2,
      title: 'Climate Change Impact on Marine Ecosystems',
      abstract: 'This study examines the effects of climate change on marine ecosystems, with a particular focus on coral reefs and oceanic biodiversity.',
      content: 'Climate change is causing significant alterations to marine ecosystems worldwide. Rising ocean temperatures, ocean acidification, and changing currents are affecting marine biodiversity and ecosystem functioning...',
      authorName: 'Dr. Michael Rodriguez',
      authorId: 'user234',
      authorAffiliation: 'Scripps Institution of Oceanography',
      coverImage: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=1000&auto=format&fit=crop',
      domain: PaperDomain.Biology,
      keywords: ['climate change', 'marine ecosystems', 'coral reefs', 'biodiversity', 'ocean acidification'],
      createdDate: '2023-05-10T08:45:00',
      lastModifiedDate: '2023-05-12T11:20:00',
      isApproved: true,
      rating: 4.5,
      ratingCount: 18,
      comments: [
        {
          id: 3,
          authorName: 'Dr. Lisa Wang',
          authorId: 'user345',
          content: 'A well-researched paper that highlights the urgent need for action on climate change to protect our oceans.',
          createdDate: '2023-05-15T14:10:00'
        }
      ]
    },
    {
      id: 3,
      title: 'Neural Networks for Natural Language Processing',
      abstract: 'This paper explores the application of neural networks in natural language processing tasks, including sentiment analysis, machine translation, and text generation.',
      content: 'Natural Language Processing (NLP) has seen remarkable progress with the advent of deep learning techniques. Neural networks have revolutionized how computers understand and generate human language...',
      authorName: 'Prof. Robert Thompson',
      authorId: 'user567',
      authorAffiliation: 'Stanford University',
      coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
      pdfUrl: 'https://example.com/neural-nlp.pdf',
      domain: PaperDomain.ComputerScience,
      keywords: ['neural networks', 'natural language processing', 'deep learning', 'NLP', 'transformer models'],
      createdDate: '2023-07-05T16:15:00',
      lastModifiedDate: '2023-07-10T09:30:00',
      isApproved: true,
      rating: 4.9,
      ratingCount: 32,
      comments: [
        {
          id: 4,
          authorName: 'Dr. James Wilson',
          authorId: 'user678',
          content: 'The comparison between LSTM and transformer architectures is very informative.',
          createdDate: '2023-07-08T13:20:00'
        },
        {
          id: 5,
          authorName: 'Dr. Anna Martinez',
          authorId: 'user890',
          content: 'Excellent overview of the current state of the art in NLP.',
          createdDate: '2023-07-09T10:45:00'
        }
      ],
      attachments: [
        {
          id: 2,
          name: 'Code Repository',
          fileUrl: 'https://github.com/example/nlp-neural-networks',
          fileType: 'text/html',
          fileSize: 0
        }
      ]
    },
    {
      id: 4,
      title: 'Renaissance Influence on Modern Art',
      abstract: 'This paper examines the enduring influence of Renaissance art techniques and philosophies on contemporary artistic expressions.',
      content: 'The Renaissance period, spanning roughly from the 14th to the 17th century, revolutionized artistic techniques and philosophies that continue to influence modern artistic expressions...',
      authorName: 'Prof. Isabella Romano',
      authorId: 'user901',
      authorAffiliation: 'Florence University of Arts',
      coverImage: 'https://images.unsplash.com/photo-1577083552876-424463cede5c?q=80&w=1000&auto=format&fit=crop',
      domain: PaperDomain.Art,
      keywords: ['renaissance', 'modern art', 'artistic influence', 'art history', 'contemporary art'],
      createdDate: '2023-04-20T11:30:00',
      lastModifiedDate: '2023-04-25T15:45:00',
      isApproved: true,
      rating: 4.6,
      ratingCount: 15
    },
    {
      id: 5,
      title: 'Sustainable Urban Development: Challenges and Solutions',
      abstract: 'This research investigates the challenges and potential solutions for sustainable urban development in rapidly growing metropolitan areas.',
      content: 'Urbanization is accelerating globally, with more than half of the world\'s population now living in cities. This rapid growth presents numerous challenges for sustainable development...',
      authorName: 'Dr. Carlos Mendes',
      authorId: 'user112',
      authorAffiliation: 'University of Barcelona',
      coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop',
      domain: PaperDomain.SocialSciences,
      keywords: ['urban development', 'sustainability', 'smart cities', 'urban planning', 'green infrastructure'],
      createdDate: '2023-03-15T09:20:00',
      lastModifiedDate: '2023-03-18T14:10:00',
      isApproved: false,
      rating: 0,
      ratingCount: 0
    }
  ];

  constructor() { }

  getPapers(filter?: PaperFilter): Observable<Paper[]> {
    // Apply filters if provided
    let filteredPapers = this.mockPapers;
    
    if (filter) {
      if (filter.domain) {
        filteredPapers = filteredPapers.filter(p => p.domain === filter.domain);
      }
      
      if (filter.authorName) {
        filteredPapers = filteredPapers.filter(p => 
          p.authorName.toLowerCase().includes(filter.authorName!.toLowerCase())
        );
      }
      
      if (filter.keyword) {
        filteredPapers = filteredPapers.filter(p => 
          p.keywords.some(k => k.toLowerCase().includes(filter.keyword!.toLowerCase())) ||
          p.title.toLowerCase().includes(filter.keyword!.toLowerCase()) ||
          p.abstract.toLowerCase().includes(filter.keyword!.toLowerCase())
        );
      }
      
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom);
        filteredPapers = filteredPapers.filter(p => 
          new Date(p.createdDate!) >= fromDate
        );
      }
      
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo);
        filteredPapers = filteredPapers.filter(p => 
          new Date(p.createdDate!) <= toDate
        );
      }
    }
    
    // Return only approved papers (unless you're an admin)
    filteredPapers = filteredPapers.filter(p => p.isApproved === true);
    
    // Add a small delay to simulate network request
    return of(filteredPapers).pipe(delay(300));
  }

  getPaperById(id: number): Observable<Paper | undefined> {
    const paper = this.mockPapers.find(p => p.id === id);
    
    // Return a deep copy to avoid reference issues
    const paperCopy = paper ? this.deepCopy(paper) : undefined;
    
    return of(paperCopy).pipe(delay(300));
  }

  addPaper(paper: Paper): Observable<Paper> {
    // Create a new paper with a generated ID
    const newPaper: Paper = {
      ...paper,
      id: this.getNextId(),
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      isApproved: false,
      rating: 0,
      ratingCount: 0,
      comments: []
    };
    
    this.mockPapers.push(newPaper);
    return of(newPaper).pipe(delay(500));
  }

  updatePaper(paper: Paper): Observable<Paper> {
    const index = this.mockPapers.findIndex(p => p.id === paper.id);
    if (index !== -1) {
      // Update the paper while preserving certain fields
      this.mockPapers[index] = {
        ...this.mockPapers[index],
        ...paper,
        lastModifiedDate: new Date().toISOString()
      };
      return of(this.mockPapers[index]).pipe(delay(500));
    }
    
    return of(paper).pipe(delay(500));
  }

  deletePaper(id: number): Observable<boolean> {
    const index = this.mockPapers.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockPapers.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }

  addComment(paperId: number, comment: Omit<PaperComment, 'id' | 'createdDate'>): Observable<PaperComment> {
    // Find the paper index
    const paperIndex = this.mockPapers.findIndex(p => p.id === paperId);
    
    if (paperIndex !== -1) {
      // Get a reference to the paper
      const paper = this.mockPapers[paperIndex];
      
      // Create the new comment
      const newComment: PaperComment = {
        id: this.getNextCommentId(paper),
        ...comment,
        createdDate: new Date().toISOString()
      };
      
      // Initialize comments array if needed
      if (!paper.comments) {
        paper.comments = [];
      }
      
      // Add to the in-memory mock data 
      paper.comments.push(newComment);
      
      // Return a deep copy to avoid reference issues
      return of(this.deepCopy(newComment)).pipe(delay(500));
    }
    
    throw new Error('Paper not found');
  }

  ratePaper(paperId: number, rating: number): Observable<Paper> {
    const paper = this.mockPapers.find(p => p.id === paperId);
    
    if (paper) {
      if (paper.rating === undefined || paper.ratingCount === undefined) {
        paper.rating = rating;
        paper.ratingCount = 1;
      } else {
        // Calculate new average rating
        const totalRating = paper.rating * paper.ratingCount;
        paper.ratingCount += 1;
        paper.rating = (totalRating + rating) / paper.ratingCount;
      }
      
      return of(paper).pipe(delay(500));
    }
    
    throw new Error('Paper not found');
  }

  getPaperDomains(): Observable<string[]> {
    return of(Object.values(PaperDomain)).pipe(delay(200));
  }

  // Helper methods
  private getNextId(): number {
    return Math.max(...this.mockPapers.map(p => p.id || 0)) + 1;
  }

  private getNextCommentId(paper: Paper): number {
    if (!paper.comments || paper.comments.length === 0) {
      return 1;
    }
    return Math.max(...paper.comments.map(c => c.id || 0)) + 1;
  }

  // Helper for deep copying objects
  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
