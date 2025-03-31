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
}

export interface CommentFilter {
  sortBy?: 'newest' | 'oldest' | 'popular';
  showReplies?: boolean;
} 