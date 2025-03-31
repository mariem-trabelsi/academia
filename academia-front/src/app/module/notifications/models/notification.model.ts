export type NotificationType = 
  'paper_citation' | 
  'new_follower' | 
  'comment' | 
  'new_paper' | 
  'mention' | 
  'collaboration_invite' | 
  'message';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionLink?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  relatedItem?: {
    id: string;
    type: 'paper' | 'comment' | 'discussion' | 'message';
    title?: string;
  };
} 