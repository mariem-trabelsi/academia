import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationBadgeService {
  private unreadCount = new BehaviorSubject<number>(3); // Default mock count
  
  constructor() {
    // In a real app, this would initialize from the API
    // and listen for push notifications/updates
  }
  
  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }
  
  setUnreadCount(count: number): void {
    this.unreadCount.next(count);
  }
  
  incrementUnreadCount(increment: number = 1): void {
    this.unreadCount.next(this.unreadCount.value + increment);
  }
  
  clearUnreadCount(): void {
    this.unreadCount.next(0);
  }
} 