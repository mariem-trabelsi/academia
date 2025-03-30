import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaperDomain, PaperFilter } from '../../models/paper';
import { PaperService } from '../../services/paper.service';

@Component({
  selector: 'app-paper-filter',
  templateUrl: './paper-filter.component.html',
  styleUrls: ['./paper-filter.component.scss']
})
export class PaperFilterComponent implements OnInit {
  @Input() filter: PaperFilter = {};
  @Output() filterChange = new EventEmitter<PaperFilter>();
  
  domains: string[] = [];
  isFiltersVisible = false;
  
  constructor(private paperService: PaperService) {}
  
  ngOnInit(): void {
    this.loadDomains();
  }
  
  loadDomains(): void {
    this.paperService.getPaperDomains().subscribe(domains => {
      this.domains = domains;
    });
  }
  
  applyFilters(): void {
    this.filterChange.emit(this.filter);
    this.toggleFilters();
  }
  
  clearFilters(): void {
    this.filter = {};
    this.filterChange.emit(this.filter);
    this.toggleFilters();
  }
  
  toggleFilters(): void {
    this.isFiltersVisible = !this.isFiltersVisible;
  }
  
  searchByKeyword(event: Event): void {
    event.preventDefault();
    this.filterChange.emit(this.filter);
  }
}
