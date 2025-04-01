import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { UserManagement } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
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
export class UserManagementComponent {
  
  keycloakUrl = 'http://localhost:9090/admin/master/console/#/academia/users';
  activeTab: 'users' | 'keycloak' = 'users';

  showUsersList() {
    this.activeTab = 'users';
  }

  showKeycloak() {
    this.activeTab = 'keycloak';
  }
  /*
implements OnInit {
  users: UserManagement[] = [];
  filteredUsers: UserManagement[] = [];
  selectedUser: UserManagement | null = null;
  searchTerm: string = '';
  statusFilter: 'all' | 'active' | 'suspended' | 'inactive' = 'all';
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUserManagementList().subscribe(users => {
      this.users = users;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      // Apply search filter
      const searchMatch = this.searchTerm === '' || 
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = this.statusFilter === 'all' || user.status === this.statusFilter;
      
      return searchMatch && statusMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(status: 'all' | 'active' | 'suspended' | 'inactive'): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  viewUserDetails(user: UserManagement): void {
    this.selectedUser = user;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
  }

  updateUserStatus(userId: number, status: 'active' | 'suspended' | 'inactive'): void {
    this.adminService.updateUserStatus(userId, status).subscribe(success => {
      if (success) {
        // In a real application, we would update from the API
        // For the mock, we'll just update locally
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = status;
          this.applyFilters();
        }
      }
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'suspended': return 'status-suspended';
      default: return 'status-inactive';
    }
  }
  
  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  
  getInitials(name: string): string {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  getRandomColor(userId: number): string {
    const colors = [
      '#4285F4', '#DB4437', '#F4B400', '#0F9D58', 
      '#AB47BC', '#00ACC1', '#FF7043', '#9E9E9E'
    ];
    return colors[userId % colors.length];
  }*/
 
}
