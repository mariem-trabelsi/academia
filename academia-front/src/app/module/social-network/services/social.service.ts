import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Researcher, Publication, ResearchGroup, Member } from '../models/social';
import { environment } from '../../../../environments/environment';

// Add missing interfaces needed by the network dashboard
export interface ResearchUpdate {
  id: number;
  researcher: Researcher;
  updateType: UpdateType;
  content: string;
  paperTitle?: string;
  paperId?: number;
  paperImage?: string;
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

export enum UpdateType {
  PAPER_PUBLISHED = 'PAPER_PUBLISHED',
  RESEARCH_UPDATE = 'RESEARCH_UPDATE',
  COLLABORATION_OPPORTUNITY = 'COLLABORATION_OPPORTUNITY',
  CONFERENCE_ANNOUNCEMENT = 'CONFERENCE_ANNOUNCEMENT',
  QUESTION = 'QUESTION'
}

export interface NetworkStats {
  totalFollowers: number;
  totalFollowing: number;
  newUpdates: number;
  unreadMessages: number;
  pendingCollaborations: number;
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private apiUrl = environment.apiUrl + '/social';
  
  // Mock image collections for fallbacks and testing
  private mockProfileImages = [
    'https://images.unsplash.com/photo-1550082849-6d7e9f1a0bd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80', // Male professor
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80', // Female researcher
    'https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80', // Male researcher
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80', // Female scientist
    'https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80', // Male scientist
  ];

  private mockCoverImages = [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Science lab
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Campus
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Library
    'https://images.unsplash.com/photo-1576072446584-4576452d9d08?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Classroom
    'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Research space
  ];

  private mockGroupImages = [
    'https://images.unsplash.com/photo-1596496356956-8b0c04d767f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Conference room
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Team meeting
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Study group
    'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Research lab
    'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Collaboration space
  ];
  
  // Mock data for development (remove in production)
  private mockResearchers: Researcher[] = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      title: 'Associate Professor',
      institution: 'University of Science',
      profileImage: this.mockProfileImages[1],
      coverImage: this.mockCoverImages[0],
      bio: 'Specializing in quantum computing and artificial intelligence, with a focus on developing novel algorithms for complex optimization problems.',
      publications: 32,
      citations: 1250,
      followers: 245,
      researchInterests: ['Quantum Computing', 'AI', 'Optimization Algorithms', 'Machine Learning'],
      education: [
        { degree: 'Ph.D. Computer Science', institution: 'MIT', year: '2015' },
        { degree: 'M.S. Computer Science', institution: 'Stanford University', year: '2011' },
        { degree: 'B.S. Physics', institution: 'Caltech', year: '2009' }
      ],
      isFollowing: false
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      title: 'Professor',
      institution: 'Cambridge University',
      profileImage: this.mockProfileImages[0],
      coverImage: this.mockCoverImages[1],
      bio: 'Leading researcher in climate modeling and environmental data science, working on predictive models for climate change impacts.',
      publications: 87,
      citations: 3200,
      followers: 512,
      researchInterests: ['Climate Modeling', 'Environmental Science', 'Data Science', 'Sustainability'],
      education: [
        { degree: 'Ph.D. Environmental Science', institution: 'Oxford University', year: '2008' },
        { degree: 'M.S. Applied Mathematics', institution: 'Cambridge University', year: '2004' },
        { degree: 'B.S. Earth Sciences', institution: 'University of California, Berkeley', year: '2002' }
      ],
      isFollowing: true
    }
  ];
  
  private mockPublications: Publication[] = [
    {
      id: 101,
      title: 'Quantum Algorithm for Linear Systems of Equations with Exponential Speedup',
      authors: 'Smith, J., Johnson, R., Williams, T.',
      journal: 'Journal of Quantum Information Processing',
      year: '2022',
      citations: 45,
      downloads: 320,
      abstract: 'We present a novel quantum algorithm for solving linear systems of equations that provides an exponential speedup over the best known classical algorithms. Our approach builds upon the HHL algorithm with optimizations for specific classes of matrices that occur frequently in machine learning applications.'
    },
    {
      id: 102,
      title: 'Machine Learning Approaches to Climate Prediction: A Comparative Study',
      authors: 'Smith, J., Chen, M., Garcia, L.',
      journal: 'Nature Climate Change',
      year: '2021',
      citations: 78,
      downloads: 560,
      abstract: 'This paper compares various machine learning approaches to climate prediction, including deep neural networks, random forests, and gradient boosting models. We evaluate their performance on historical climate data and discuss implications for improving long-term climate forecasts.'
    },
    {
      id: 103,
      title: 'Explainable AI for Scientific Discovery: Applications in Materials Science',
      authors: 'Smith, J., Anderson, P.',
      journal: 'Science Advances',
      year: '2020',
      citations: 124,
      downloads: 890,
      abstract: 'We demonstrate how explainable AI techniques can accelerate scientific discovery in materials science. Our framework combines deep learning with domain knowledge to discover new materials with desired properties while providing interpretable explanations of the underlying scientific principles.'
    }
  ];

  private mockGroups: ResearchGroup[] = [
    {
      id: 1,
      name: 'Quantum Computing Research Collective',
      description: 'A collaborative group focused on advancing quantum computing algorithms and applications.',
      detailedDescription: 'Our research group brings together experts from computer science, physics, and mathematics to tackle fundamental challenges in quantum computing. We focus on developing novel quantum algorithms, quantum error correction techniques, and practical applications in optimization and machine learning.',
      coverImage: this.mockGroupImages[3],
      institution: 'University of Science',
      memberCount: 34,
      isPrivate: false,
      isMember: true,
      researchFocus: ['Quantum Algorithms', 'Quantum Error Correction', 'Quantum Machine Learning', 'Quantum Simulation'],
      rules: [
        'Share research findings with the group before public release',
        'Acknowledge the group in publications that result from collaborative work',
        'Participate in at least 50% of group meetings'
      ],
      admin: {
        id: 1,
        name: 'Dr. Jane Smith'
      }
    },
    {
      id: 2,
      name: 'Climate Data Science Initiative',
      description: 'Applying data science methods to climate research and environmental modeling.',
      detailedDescription: 'The Climate Data Science Initiative is an interdisciplinary group that applies cutting-edge data science techniques to climate research. We work on improving climate models, analyzing large-scale environmental datasets, and developing tools for better climate predictions and impact assessments.',
      coverImage: this.mockGroupImages[1],
      institution: 'Cambridge University',
      memberCount: 42,
      isPrivate: true,
      isMember: false,
      researchFocus: ['Climate Modeling', 'Environmental Data Analysis', 'Machine Learning for Climate Science', 'Climate Change Impact Assessment'],
      rules: [
        'Maintain data confidentiality as specified in individual projects',
        'Follow the group\'s code of ethics for climate research',
        'Contribute to the group\'s open-source tools at least quarterly'
      ],
      admin: {
        id: 2,
        name: 'Dr. Michael Chen'
      }
    }
  ];

  private mockMembers: Member[] = [
    {
      id: 1,
      name: 'Dr. Jane Smith',
      title: 'Associate Professor',
      institution: 'University of Science',
      profileImage: this.mockProfileImages[1],
      isAdmin: true
    },
    {
      id: 3,
      name: 'Dr. Robert Johnson',
      title: 'Assistant Professor',
      institution: 'University of Science',
      profileImage: this.mockProfileImages[2],
      isAdmin: false
    },
    {
      id: 4,
      name: 'Dr. Emilia Garcia',
      title: 'Research Scientist',
      institution: 'Quantum Research Institute',
      profileImage: this.mockProfileImages[3],
      isAdmin: false
    }
  ];

  // Mock updates for network feed
  private mockUpdates: ResearchUpdate[] = [
    {
      id: 1,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.PAPER_PUBLISHED,
      content: 'I\'m pleased to announce my latest publication on quantum algorithms with exponential speedup for linear systems.',
      paperTitle: 'Quantum Algorithm for Linear Systems of Equations with Exponential Speedup',
      paperId: 101,
      paperImage: 'assets/images/papers/quantum-paper.jpg',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 42,
      comments: 7,
      isLiked: false
    },
    {
      id: 2,
      researcher: this.mockResearchers[1],
      updateType: UpdateType.RESEARCH_UPDATE,
      content: 'Our climate model has shown promising results in predicting regional temperature patterns with 30% greater accuracy than previous models.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 29,
      comments: 5,
      isLiked: true
    },
    {
      id: 3,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.COLLABORATION_OPPORTUNITY,
      content: 'Looking for collaborators with expertise in neural networks for a new project combining quantum computing with deep learning. Please message if interested!',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      comments: 8,
      isLiked: false
    },
    {
      id: 4,
      researcher: this.mockResearchers[1],
      updateType: UpdateType.CONFERENCE_ANNOUNCEMENT,
      content: 'I\'ll be speaking at the International Climate Science Conference next month. My talk will cover recent advances in climate modeling using machine learning techniques.',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 37,
      comments: 12,
      isLiked: false
    },
    {
      id: 5,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.PAPER_PUBLISHED,
      content: 'Just published our new findings on quantum entanglement in multi-qubit systems.',
      paperTitle: 'Experimental Realization of Robust Quantum Entanglement in Multi-Qubit Systems',
      paperId: 102,
      paperImage: this.mockCoverImages[2],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 53,
      comments: 9,
      isLiked: true
    },
    {
      id: 6,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.QUESTION,
      content: 'Has anyone successfully implemented the Zhang-Kondo algorithm for quantum error correction on IBM\'s quantum hardware? I\'m encountering some unusual decoherence patterns.',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: 14,
      isLiked: false
    },
    {
      id: 7,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.RESEARCH_UPDATE,
      content: 'Exciting breakthrough in our lab today! We\'ve managed to increase quantum coherence time by 27% using a novel cooling technique.',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 71,
      comments: 23,
      isLiked: false
    },
    {
      id: 8,
      researcher: this.mockResearchers[1],
      updateType: UpdateType.PAPER_PUBLISHED,
      content: 'Our paper on climate change impact on biodiversity hotspots has been published in Nature Climate Change.',
      paperTitle: 'Predicted Climate-Induced Shifts in Biodiversity Hotspots: Implications for Conservation Strategies',
      paperId: 103,
      paperImage: this.mockCoverImages[3],
      createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 16,
      isLiked: true
    },
    {
      id: 9,
      researcher: this.mockResearchers[1],
      updateType: UpdateType.COLLABORATION_OPPORTUNITY,
      content: 'Our research team is looking for computational biologists with expertise in protein folding simulations for a new interdisciplinary project. DM me if interested!',
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      comments: 5,
      isLiked: false
    },
    {
      id: 10,
      researcher: this.mockResearchers[0],
      updateType: UpdateType.CONFERENCE_ANNOUNCEMENT,
      content: 'Registration is now open for the Quantum Computing Summer School 2023! Featuring workshops on quantum algorithms, error correction, and hands-on sessions with quantum hardware.',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      comments: 7,
      isLiked: false
    }
  ];

  constructor(private http: HttpClient) { }
  
  // Methods needed by NetworkDashboard component
  getNetworkFeed(page: number = 1, limit: number = 10): Observable<ResearchUpdate[]> {
    // In production, use:
    // return this.http.get<ResearchUpdate[]>(`${this.apiUrl}/feed?page=${page}&limit=${limit}`);
    
    // For development:
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = this.mockUpdates.slice(startIndex, endIndex);
    return of(paginatedResults).pipe(delay(800));
  }
  
  getSuggestedResearchers(): Observable<Researcher[]> {
    // In production, use:
    // return this.http.get<Researcher[]>(`${this.apiUrl}/researchers/suggested`);
    
    // For development:
    return of(this.mockResearchers).pipe(delay(600));
  }
  
  getResearchGroups(): Observable<ResearchGroup[]> {
    // In production, use:
    // return this.http.get<ResearchGroup[]>(`${this.apiUrl}/groups`);
    
    // For development:
    return of(this.mockGroups).pipe(delay(700));
  }
  
  getNetworkStats(): Observable<NetworkStats> {
    // In production, use:
    // return this.http.get<NetworkStats>(`${this.apiUrl}/stats`);
    
    // For development:
    return of({
      totalFollowers: 245,
      totalFollowing: 162,
      newUpdates: 8,
      unreadMessages: 3,
      pendingCollaborations: 2
    }).pipe(delay(500));
  }
  
  // Researcher profiles
  
  getResearcherProfile(id: number): Observable<Researcher> {
    // In production, use:
    // return this.http.get<Researcher>(`${this.apiUrl}/researchers/${id}`);
    
    // For development:
    const researcher = this.mockResearchers.find(r => r.id === id);
    return of(researcher || this.mockResearchers[0]).pipe(delay(800));
  }
  
  getResearcherPublications(researcherId: number): Observable<Publication[]> {
    // In production, use:
    // return this.http.get<Publication[]>(`${this.apiUrl}/researchers/${researcherId}/publications`);
    
    // For development:
    return of(this.mockPublications).pipe(delay(1000));
  }
  
  followResearcher(researcherId: number): Observable<{success: boolean}> {
    // In production, use:
    // return this.http.post<{success: boolean}>(`${this.apiUrl}/researchers/${researcherId}/follow`, {});
    
    // For development:
    const researcher = this.mockResearchers.find(r => r.id === researcherId);
    if (researcher) {
      researcher.isFollowing = !researcher.isFollowing;
      if (researcher.isFollowing) {
        researcher.followers += 1;
      } else {
        researcher.followers -= 1;
      }
    }
    return of({success: true}).pipe(delay(300));
  }
  
  // Research groups
  
  getGroupDetails(groupId: number): Observable<ResearchGroup> {
    // In production, use:
    // return this.http.get<ResearchGroup>(`${this.apiUrl}/groups/${groupId}`);
    
    // For development:
    const group = this.mockGroups.find(g => g.id === groupId);
    return of(group || this.mockGroups[0]).pipe(delay(800));
  }
  
  getGroupMembers(groupId: number): Observable<Member[]> {
    // In production, use:
    // return this.http.get<Member[]>(`${this.apiUrl}/groups/${groupId}/members`);
    
    // For development:
    return of(this.mockMembers).pipe(delay(1000));
  }
  
  joinGroup(groupId: number): Observable<{success: boolean}> {
    // In production, use:
    // return this.http.post<{success: boolean}>(`${this.apiUrl}/groups/${groupId}/join`, {});
    
    // For development:
    const group = this.mockGroups.find(g => g.id === groupId);
    if (group) {
      group.isMember = !group.isMember;
      group.memberCount += group.isMember ? 1 : -1;
    }
    return of({success: true}).pipe(delay(300));
  }
  
  // Common methods
  
  searchResearchers(query: string): Observable<Researcher[]> {
    // In production, use:
    // return this.http.get<Researcher[]>(`${this.apiUrl}/search/researchers?q=${query}`);
    
    // For development:
    const filteredResearchers = this.mockResearchers.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) || 
      r.institution.toLowerCase().includes(query.toLowerCase()));
    return of(filteredResearchers).pipe(delay(500));
  }
  
  searchGroups(query: string): Observable<ResearchGroup[]> {
    // In production, use:
    // return this.http.get<ResearchGroup[]>(`${this.apiUrl}/search/groups?q=${query}`);
    
    // For development:
    const filteredGroups = this.mockGroups.filter(g => 
      g.name.toLowerCase().includes(query.toLowerCase()) || 
      g.description.toLowerCase().includes(query.toLowerCase()));
    return of(filteredGroups).pipe(delay(500));
  }
}