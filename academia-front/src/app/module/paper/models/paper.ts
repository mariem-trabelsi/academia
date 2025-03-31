export interface Paper {
    id?: number;
    title: string;
    abstract: string;
    content: string;
    authorName: string;
    authorId?: string;
    authorAffiliation?: string;
    coverImage?: string;
    pdfUrl?: string;
    attachments?: PaperAttachment[];
    domain: string;
    keywords: string[];
    createdDate?: string;
    lastModifiedDate?: string;
    isApproved?: boolean;
    rating?: number;
    ratingCount?: number;
    comments?: PaperComment[];
}

export interface PaperAttachment {
    id?: number;
    name: string;
    fileUrl: string;
    fileType: string;
    fileSize?: number;
}

export interface PaperComment {
    id?: number;
    authorName: string;
    authorId?: string;
    content: string;
    createdDate: string;
}

export interface PaperFilter {
    domain?: string;
    authorName?: string;
    keyword?: string;
    dateFrom?: string;
    dateTo?: string;
}

export enum PaperDomain {
    ComputerScience = 'Computer Science',
    Biology = 'Biology',
    Physics = 'Physics',
    Medicine = 'Medicine',
    Economics = 'Economics',
    Mathematics = 'Mathematics',
    Engineering = 'Engineering',
    Psychology = 'Psychology',
    Chemistry = 'Chemistry',
    SocialSciences = 'Social Sciences',
    Art = 'Art',
    Literature = 'Literature',
    Philosophy = 'Philosophy',
    History = 'History',
    Other = 'Other'
}
