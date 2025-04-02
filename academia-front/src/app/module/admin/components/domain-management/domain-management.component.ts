import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomainControllerService } from 'src/app/services/services/domain-controller.service';
//import { Domain } from 'src/app/services/models/domain';
import { Article } from 'src/app/services/models/article';

interface Domain {
  articles?: Array<Article>;
  description?: string;
  id?: number;
  name?: string;
  articleCount?: number;
}// hne belani amlat interface admin hardcoded khater articleCount mahiech mawjouda f backend 
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
    private fb: FormBuilder,
    private domainService: DomainControllerService
  ) {
    this.domainForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadDomains();
  }
    
  loadDomains(): void {
    this.domainService.getAllDomains().subscribe(domains => {
      this.domains = domains;
      this.applyFilters();
      this.getArticlesCountByDomain(); 
    });
  }
  
  

  applyFilters(): void {
    let filtered = [...this.domains];
    
    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(domain => 
        domain.name?.toLowerCase().includes(search) || 
        domain.description?.toLowerCase().includes(search)
      );
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
    this.showAddDomainModal = true;
  }

 

  openEditDomainModal(domain: Domain): void {
    console.log("Editing domain:", domain);
    this.isEditMode = true;
    this.domainForm.patchValue({
      name: domain.name,
      description: domain.description || '',

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
      };

      if (updatedDomain.id !== undefined) {
        this.domainService.updateDomainById({ id: updatedDomain.id, body: updatedDomain }).subscribe(updated => {
          const index = this.domains.findIndex(d => d.id === updated.id);
          if (index !== -1) {
            this.domains[index] = updated;
            this.applyFilters();
          }
          this.getArticlesCountByDomain();
          this.closeAddDomainModal();
          this.closeDomainDetails();
        });
      }
    } else {
      this.domainService.createDomain({ body: formValue }).subscribe(newDomain => {
        this.domains.push(newDomain);
        this.applyFilters();
        this.getArticlesCountByDomain();
        this.closeAddDomainModal();
      });
    }
  }

  deleteDomain(domain: Domain): void {
    if (domain.id !== undefined) {
  
        this.domainService.deleteDomainById({ id: domain.id }).subscribe(() => {
          this.domains = this.domains.filter(d => d.id !== domain.id);
          this.applyFilters();
          this.closeDomainDetails();
          alert(`Domain "${domain.name}" deleted successfully.`);
        }, error => {
          alert(`An error occurred while deleting the domain "${domain.name}". Please try again.`);
        });
      
    }
  }

 

  getArticlesCountByDomain(): void {
    this.domains.forEach(domain => {
      if (domain.id !== undefined) {
        this.domainService.getArticlesByDomain({ id: domain.id }).subscribe(articles => {
          domain.articleCount = articles.length;
          this.applyFilters();
        });
      }
    });
  }
  
}
