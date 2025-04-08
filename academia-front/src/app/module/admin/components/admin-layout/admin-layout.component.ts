import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;
  activeSection: 'dashboard' | 'approval' |'archived'| 'users' | 'domains' | 'moderation' | 'statistics' | 'settings' = 'dashboard';

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  handleSectionChange(section: string): void {
    this.activeSection = section as 'dashboard' | 'approval' |'archived'| 'users' | 'domains' | 'moderation' | 'statistics' | 'settings';
  }
}
