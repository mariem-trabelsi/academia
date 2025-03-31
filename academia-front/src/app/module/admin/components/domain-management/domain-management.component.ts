import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Domain } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-domain-management',
  templateUrl: './domain-management.component.html',
  styleUrls: ['./domain-management.component.scss'],
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class DomainManagementComponent implements OnInit {
  domains: Domain[] = [];
  filteredDomains: Domain[] = [];
  selectedDomain: Domain | null = null;
  searchQuery: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  showAddDomainModal: boolean = false;
  domainForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.domainForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['active']
    });
  }

  ngOnInit(): void {
    this.loadDomains();
  }

  loadDomains(): void {
    this.adminService.getDomainsList().subscribe(domains => {
      this.domains = domains;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.domains];
    
    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(domain => 
        domain.name.toLowerCase().includes(search) || 
        domain.description.toLowerCase().includes(search)
      );
    }
    
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(domain => domain.status === this.statusFilter);
    }
    
    this.filteredDomains = filtered;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.applyFilters();
  }

  viewDomainDetails(domain: Domain): void {
    this.selectedDomain = { ...domain };
  }

  closeDomainDetails(): void {
    this.selectedDomain = null;
  }

  openAddDomainModal(): void {
    this.isEditMode = false;
    this.domainForm.reset({ status: 'active' });
    this.showAddDomainModal = true;
  }

  openEditDomainModal(domain: Domain): void {
    this.isEditMode = true;
    this.domainForm.setValue({
      name: domain.name,
      description: domain.description,
      status: domain.status
    });
    this.selectedDomain = domain;
    this.showAddDomainModal = true;
  }

  closeAddDomainModal(): void {
    this.showAddDomainModal = false;
    this.domainForm.reset();
  }

  submitDomainForm(): void {
    if (this.domainForm.invalid) {
      return;
    }

    const formValue = this.domainForm.value;
    
    if (this.isEditMode && this.selectedDomain) {
      const updatedDomain: Domain = {
        ...this.selectedDomain,
        name: formValue.name,
        description: formValue.description,
        status: formValue.status,
        lastModified: new Date()
      };
      
      this.adminService.updateDomain(updatedDomain).subscribe(success => {
        if (success) {
          // In a real app, we would refresh from API
          // For the mock, update locally
          const index = this.domains.findIndex(d => d.id === updatedDomain.id);
          if (index !== -1) {
            this.domains[index] = updatedDomain;
            this.applyFilters();
          }
          this.closeAddDomainModal();
          this.closeDomainDetails();
        }
      });
    } else {
      this.adminService.createDomain(formValue).subscribe(newDomain => {
        // In a real app, we would refresh from API
        // For the mock, update locally
        this.domains.push(newDomain);
        this.applyFilters();
        this.closeAddDomainModal();
      });
    }
  }

  updateDomainStatus(domain: Domain, status: 'active' | 'inactive'): void {
    this.adminService.updateDomainStatus(domain.id, status).subscribe(success => {
      if (success) {
        // In a real app, we would refresh from API
        // For the mock, update locally
        const index = this.domains.findIndex(d => d.id === domain.id);
        if (index !== -1) {
          this.domains[index] = {
            ...domain,
            status,
            lastModified: new Date()
          };
          this.applyFilters();
        }
        this.closeDomainDetails();
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      default: return '';
    }
  }
} 