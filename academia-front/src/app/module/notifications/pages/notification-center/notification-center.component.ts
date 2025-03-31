import { Component, OnInit } from '@angular/core';
import { Notification } from '../../models/notification.model';
import { NotificationService } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NotificationBadgeService } from '../../../../shared/services/notification-badge.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.scss'],
  animations: [
    trigger('staggerFade', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  currentFilter: string | undefined;

  constructor(
    private notificationService: NotificationService,
    private notificationBadgeService: NotificationBadgeService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(type?: string): void {
    this.loading = true;
    this.currentFilter = type;
    
    setTimeout(() => {
      this.notificationService.getFilteredNotifications(type)
        .subscribe(notifications => {
          this.notifications = notifications;
          this.loading = false;
          
          // Update badge count with unread notifications
          const unreadCount = notifications.filter(n => !n.isRead).length;
          this.notificationBadgeService.setUnreadCount(unreadCount);
        });
    }, 500); // Simulate network delay
  }

  handleFilterChange(filterType: string | undefined): void {
    this.loadNotifications(filterType);
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      // Find the notification that was marked as read
      const notification = this.notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        // Decrement the unread count
        this.notificationBadgeService.incrementUnreadCount(-1);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      // Clear the notification badge
      this.notificationBadgeService.clearUnreadCount();
      this.loadNotifications(this.currentFilter);
    });
  }
} 