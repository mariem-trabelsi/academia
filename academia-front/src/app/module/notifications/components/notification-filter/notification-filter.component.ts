import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-notification-filter',
  templateUrl: './notification-filter.component.html',
  styleUrls: ['./notification-filter.component.scss']
})
export class NotificationFilterComponent {
  @Output() filterChange = new EventEmitter<string | undefined>();
  
  filters = [
    { id: undefined, label: 'All Notifications', icon: 'fas fa-bell' },
    { id: 'paper_citation', label: 'Citations', icon: 'fas fa-quote-right' },
    { id: 'new_follower', label: 'New Followers', icon: 'fas fa-user-plus' },
    { id: 'comment', label: 'Comments', icon: 'fas fa-comment' },
    { id: 'new_paper', label: 'New Papers', icon: 'fas fa-file-alt' },
    { id: 'message', label: 'Messages', icon: 'fas fa-envelope' },
    { id: 'collaboration_invite', label: 'Collaborations', icon: 'fas fa-users' }
  ];
  
  selectedFilter: string | undefined = undefined;
  
  selectFilter(filterId: string | undefined): void {
    this.selectedFilter = filterId;
    this.filterChange.emit(filterId);
  }
} 