import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ContentModeration } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-content-moderation',
  templateUrl: './content-moderation.component.html',
  styleUrls: ['./content-moderation.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class ContentModerationComponent implements OnInit {
  moderationItems: ContentModeration[] = [];
  selectedItem: ContentModeration | null = null;
  moderationNotes: string = '';
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadModerationItems();
  }

  loadModerationItems(): void {
    this.adminService.getContentModerationItems().subscribe(items => {
      this.moderationItems = items;
    });
  }

  viewItemDetails(item: ContentModeration): void {
    this.selectedItem = item;
    this.moderationNotes = '';
  }

  closeItemDetails(): void {
    this.selectedItem = null;
  }

  approveContent(item: ContentModeration): void {
    this.adminService.resolveModeration(item.id, 'approve', this.moderationNotes).subscribe(success => {
      if (success) {
        // In a real application, we would update from the API
        // For the mock, we'll just update locally
        item.status = 'approved';
        this.closeItemDetails();
      }
    });
  }

  rejectContent(item: ContentModeration): void {
    this.adminService.resolveModeration(item.id, 'reject', this.moderationNotes).subscribe(success => {
      if (success) {
        // In a real application, we would update from the API
        // For the mock, we'll just update locally
        item.status = 'rejected';
        this.closeItemDetails();
      }
    });
  }
  
  getTypeLabel(type: string): string {
    switch (type) {
      case 'comment': return 'Comment';
      case 'paper': return 'Paper';
      default: return type;
    }
  }
  
  getTypeIcon(type: string): string {
    switch (type) {
      case 'comment': return '💬';
      case 'paper': return '📄';
      default: return '📝';
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }
  
  truncateContent(content: string, maxLength: number = 70): string {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  }
}
