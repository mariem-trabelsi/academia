import { Component, Input, Output, EventEmitter } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { KeycloakService } from 'src/app/services/keycloak/keycloak.service';

interface SidebarItem {
  label: string;
  icon: string;
  section: 'dashboard' | 'approval' | 'archived' | 'users' | 'domains' | 'moderation' | 'statistics' | 'settings';
  active?: boolean;
}


@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  @Output() sectionChange = new EventEmitter<string>();
  keycloakUrl = 'http://localhost:9090/admin/master/console/#/academia/users';

  constructor(private keycloakService: KeycloakService) {}

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: '📊', section: 'dashboard', active: true },
    { label: 'Paper Approvals', icon: '📝', section: 'approval' },
    { label: 'Archived Papers', icon: '📚', section: 'archived' },
    { label: 'User Management', icon: '👥', section: 'users' },
    { label: 'Domain Management', icon: '🔖', section: 'domains' },
    { label: 'Content Moderation', icon: '🔍', section: 'moderation' },
    { label: 'Statistics', icon: '📈', section: 'statistics' },
    { label: 'Settings', icon: '⚙️', section: 'settings' },
  ];

  onItemClick(item: SidebarItem): void {
    this.sidebarItems.forEach(i => i.active = false);
    item.active = true;

    if (item.section === 'users') {
      window.location.href = this.keycloakUrl;
    }
     else if (item.section === 'settings') {
    this.keycloakService.manageAccount();

    } else {
      this.sectionChange.emit(item.section);
    }

  }
}
