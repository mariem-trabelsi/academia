import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'paper_citation',
      title: 'New Citation',
      message: 'Your paper "Quantum Computing Applications in Healthcare" was cited in a new publication.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      actionLink: '/papers/view/123',
      sender: {
        id: '5',
        name: 'Dr. Richard Feynman',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '123',
        type: 'paper',
        title: 'Emerging Paradigms in Quantum Information Science'
      }
    },
    {
      id: '2',
      type: 'new_follower',
      title: 'New Follower',
      message: 'Prof. Marie Curie is now following your research.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isRead: true,
      actionLink: '/network/researcher/789',
      sender: {
        id: '789',
        name: 'Prof. Marie Curie',
        avatar: 'assets/images/profile-placeholder.jpg'
      }
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      message: 'Dr. Einstein commented on your paper "Relativistic Effects in Modern Computing".',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: false,
      actionLink: '/papers/view/456#comments',
      sender: {
        id: '456',
        name: 'Dr. Albert Einstein',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '456',
        type: 'comment',
        title: 'Relativistic Effects in Modern Computing'
      }
    },
    {
      id: '4',
      type: 'new_paper',
      title: 'New Publication from Followed Researcher',
      message: 'Prof. Ada Lovelace published a new paper: "Algorithms for Quantum Machine Learning".',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: false,
      actionLink: '/papers/view/789',
      sender: {
        id: '101',
        name: 'Prof. Ada Lovelace',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '789',
        type: 'paper',
        title: 'Algorithms for Quantum Machine Learning'
      }
    },
    {
      id: '5',
      type: 'collaboration_invite',
      title: 'Collaboration Invitation',
      message: 'You have been invited to collaborate on a research project: "Neural Networks for Climate Prediction".',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
      actionLink: '/network/collaborations/123',
      sender: {
        id: '202',
        name: 'Dr. Grace Hopper',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '901',
        type: 'discussion',
        title: 'Neural Networks for Climate Prediction'
      }
    },
    {
      id: '6',
      type: 'message',
      title: 'New Message',
      message: 'You received a new message from Dr. Nikola Tesla regarding potential collaboration.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      isRead: false,
      actionLink: '/network/messages/303',
      sender: {
        id: '303',
        name: 'Dr. Nikola Tesla',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '303',
        type: 'message'
      }
    },
    {
      id: '7',
      type: 'mention',
      title: 'Mentioned in Discussion',
      message: 'You were mentioned in a discussion about "Future of Quantum Computing".',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      isRead: true,
      actionLink: '/articles/discussions/404',
      sender: {
        id: '404',
        name: 'Dr. Stephen Hawking',
        avatar: 'assets/images/profile-placeholder.jpg'
      },
      relatedItem: {
        id: '404',
        type: 'discussion',
        title: 'Future of Quantum Computing'
      }
    }
  ];

  constructor() { }

  getNotifications(): Observable<Notification[]> {
    // In a real implementation, this would be an HTTP request
    return of(this.mockNotifications);
  }

  getUnreadCount(): Observable<number> {
    const unreadCount = this.mockNotifications.filter(n => !n.isRead).length;
    return of(unreadCount);
  }

  markAsRead(id: string): Observable<boolean> {
    const notification = this.mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      return of(true);
    }
    return of(false);
  }

  markAllAsRead(): Observable<boolean> {
    this.mockNotifications.forEach(n => n.isRead = true);
    return of(true);
  }

  getFilteredNotifications(type?: string): Observable<Notification[]> {
    if (!type) {
      return of(this.mockNotifications);
    }
    const filtered = this.mockNotifications.filter(n => n.type === type);
    return of(filtered);
  }
} 