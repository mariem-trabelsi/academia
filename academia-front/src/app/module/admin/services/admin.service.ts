import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  PaperApproval,
  UserManagement,
  ContentModeration,
  SystemStatistic,
  DashboardSummary
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  getDashboardSummary(): Observable<DashboardSummary> {
    const mockSummary: DashboardSummary = {
      pendingPapers: 12,
      totalUsers: 2456,
      activeUsers: 876,
      moderationItems: 18,
      newRegistrations: 34,
      contentGrowth: 23
    };
    
    return of(mockSummary);
  }

  getPaperApprovalQueue(): Observable<PaperApproval[]> {
    const mockPaperQueue: PaperApproval[] = [
      {
        id: 1,
        title: 'Advanced Machine Learning Techniques for Natural Language Processing',
        abstract: 'This paper presents novel approaches to improve NLP model performance using advanced machine learning techniques...',
        authorName: 'Dr. Jane Smith',
        authorId: 24,
        domain: 'Computer Science',
        submissionDate: new Date('2023-03-15'),
        status: 'pending',
        coverImageUrl: 'assets/mock/paper1.jpg',
        pdfUrl: 'assets/mock/paper1.pdf'
      },
      {
        id: 2,
        title: 'Sustainable Urban Development in Growing Metropolitan Areas',
        abstract: 'An analysis of sustainable practices in rapidly growing urban environments with case studies from Asia and Africa...',
        authorName: 'Prof. Michael Johnson',
        authorId: 18,
        domain: 'Urban Planning',
        submissionDate: new Date('2023-03-14'),
        status: 'pending',
        coverImageUrl: 'assets/mock/paper2.jpg',
        pdfUrl: 'assets/mock/paper2.pdf'
      },
      {
        id: 3,
        title: 'The Impact of Climate Change on Marine Ecosystems',
        abstract: 'This research examines the effects of rising ocean temperatures on coral reefs and marine biodiversity...',
        authorName: 'Dr. Sarah Wilson',
        authorId: 36,
        domain: 'Marine Biology',
        submissionDate: new Date('2023-03-12'),
        status: 'pending',
        coverImageUrl: 'assets/mock/paper3.jpg',
        pdfUrl: 'assets/mock/paper3.pdf'
      },
      {
        id: 4,
        title: 'Quantum Computing Applications in Cryptography',
        abstract: 'An exploration of how quantum computing advances may impact modern encryption methods...',
        authorName: 'Dr. Robert Chen',
        authorId: 42,
        domain: 'Computer Science',
        submissionDate: new Date('2023-03-10'),
        status: 'pending',
        pdfUrl: 'assets/mock/paper4.pdf'
      },
      {
        id: 5,
        title: 'Novel Therapeutic Approaches for Neurodegenerative Diseases',
        abstract: 'This study presents promising new treatments for Alzheimer\'s and Parkinson\'s diseases...',
        authorName: 'Dr. Emily Rodriguez',
        authorId: 29,
        domain: 'Medicine',
        submissionDate: new Date('2023-03-08'),
        status: 'pending',
        coverImageUrl: 'assets/mock/paper5.jpg',
        pdfUrl: 'assets/mock/paper5.pdf'
      }
    ];
    
    return of(mockPaperQueue);
  }

  getUserManagementList(): Observable<UserManagement[]> {
    const mockUsers: UserManagement[] = [
      {
        id: 1,
        fullName: 'John Smith',
        email: 'john.smith@university.edu',
        profileImageUrl: 'assets/mock/user1.jpg',
        registrationDate: new Date('2022-06-12'),
        lastLogin: new Date('2023-03-14'),
        status: 'active',
        role: 'user',
        papersCount: 8
      },
      {
        id: 2,
        fullName: 'Maria Garcia',
        email: 'maria.garcia@research.org',
        profileImageUrl: 'assets/mock/user2.jpg',
        registrationDate: new Date('2022-09-03'),
        lastLogin: new Date('2023-03-15'),
        status: 'active',
        role: 'user',
        papersCount: 4
      },
      {
        id: 3,
        fullName: 'David Johnson',
        email: 'david.johnson@institute.net',
        profileImageUrl: 'assets/mock/user3.jpg',
        registrationDate: new Date('2022-08-17'),
        lastLogin: new Date('2023-02-28'),
        status: 'inactive',
        role: 'user',
        papersCount: 0
      },
      {
        id: 4,
        fullName: 'Admin User',
        email: 'admin@academia.edu',
        profileImageUrl: 'assets/mock/admin.jpg',
        registrationDate: new Date('2022-01-01'),
        lastLogin: new Date('2023-03-15'),
        status: 'active',
        role: 'admin',
        papersCount: 2
      },
      {
        id: 5,
        fullName: 'Susan Miller',
        email: 'susan.miller@college.edu',
        profileImageUrl: 'assets/mock/user4.jpg',
        registrationDate: new Date('2022-11-05'),
        lastLogin: new Date('2023-03-10'),
        status: 'suspended',
        role: 'user',
        papersCount: 3
      }
    ];
    
    return of(mockUsers);
  }

  getContentModerationItems(): Observable<ContentModeration[]> {
    const mockModerationItems: ContentModeration[] = [
      {
        id: 1,
        type: 'comment',
        content: 'This research is completely flawed. The author clearly has no understanding of basic principles.',
        authorName: 'James Wilson',
        authorId: 87,
        reportedBy: 'Lisa Chen',
        reportDate: new Date('2023-03-14'),
        status: 'pending',
        reason: 'Offensive language'
      },
      {
        id: 2,
        type: 'paper',
        content: 'Research paper with potentially plagiarized content',
        authorName: 'Michael Rodriguez',
        authorId: 54,
        reportedBy: 'David Thompson',
        reportDate: new Date('2023-03-13'),
        status: 'pending',
        reason: 'Suspected plagiarism'
      },
      {
        id: 3,
        type: 'comment',
        content: 'Excellent work! This paper advances the field significantly.',
        authorName: 'Sarah Johnson',
        authorId: 32,
        reportedBy: 'John Davis',
        reportDate: new Date('2023-03-12'),
        status: 'pending',
        reason: 'Spam comment'
      }
    ];
    
    return of(mockModerationItems);
  }

  getSystemStatistics(): Observable<SystemStatistic[]> {
    const mockStatistics: SystemStatistic[] = [
      {
        id: 1,
        name: 'New Users',
        value: 124,
        change: 12,
        period: 'weekly',
        trend: 'up'
      },
      {
        id: 2,
        name: 'Paper Submissions',
        value: 78,
        change: 5,
        period: 'weekly',
        trend: 'up'
      },
      {
        id: 3,
        name: 'Comments',
        value: 356,
        change: -8,
        period: 'weekly',
        trend: 'down'
      },
      {
        id: 4,
        name: 'Downloads',
        value: 1247,
        change: 23,
        period: 'weekly',
        trend: 'up'
      },
      {
        id: 5,
        name: 'Citations',
        value: 89,
        change: 0,
        period: 'weekly',
        trend: 'stable'
      },
      {
        id: 6,
        name: 'Active Sessions',
        value: 432,
        change: 15,
        period: 'daily',
        trend: 'up'
      }
    ];
    
    return of(mockStatistics);
  }

  approvePaper(paperId: number): Observable<boolean> {
    // Mock successful approval
    return of(true);
  }

  rejectPaper(paperId: number, reason: string): Observable<boolean> {
    // Mock successful rejection
    return of(true);
  }

  updateUserStatus(userId: number, status: 'active' | 'suspended' | 'inactive'): Observable<boolean> {
    // Mock successful user status update
    return of(true);
  }

  resolveModeration(itemId: number, action: 'approve' | 'reject', notes?: string): Observable<boolean> {
    // Mock successful moderation resolution
    return of(true);
  }
}
