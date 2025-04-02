export interface PaperApproval {
  id: number;
  title: string;
  abstract: string;
  authorName: string;
  authorId: number;
  domain: string;
  submissionDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  coverImageUrl?: string;
  pdfUrl?: string;
}


export interface ArticleApproval {
  id: number;
  title: string;
  abstract: string;
  authorName: string;
  domain: string;
  submissionDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  coverImageUrl?: string;
  pdfUrl?: string;
}

export interface Domain {
  id: number;
  name: string;
  description: string;
  papersCount: number;
  status: 'active' | 'inactive';
  createdDate: Date;
  lastModified?: Date;
}

export interface UserManagement {
  id: number;
  fullName: string;
  email: string;
  profileImageUrl?: string;
  registrationDate: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'inactive';
  role: 'user' | 'admin';
  papersCount: number;
}

export interface ContentModeration {
  id: number;
  type: 'comment' | 'paper';
  content: string;
  authorName: string;
  authorId: number;
  reportedBy?: string;
  reportDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

export interface SystemStatistic {
  id: number;
  name: string;
  value: number;
  change: number;
  period: 'daily' | 'weekly' | 'monthly';
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardSummary {
  pendingPapers: number;
  totalUsers: number;
  activeUsers: number;
  moderationItems: number;
  newRegistrations: number;
  contentGrowth: number;
} 