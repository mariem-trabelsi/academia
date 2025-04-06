export interface Comment {
  id?: string | number;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdDate: string | Date;
  parentId?: string | number; // For threaded comments/replies support
  likes?: number;
  isLikedByUser?: boolean; // For future implementation
  rating?: number; // Numeric rating value (1-5)
}

export interface CommentFilter {
  sortBy?: 'newest' | 'oldest' | 'popular';
  showReplies?: boolean;
} 