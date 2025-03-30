import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TopicFilter, DateRange } from '../../models/discovery';
import { DiscoveryService } from '../../services/discovery.service';
import { PaperDomain } from '../../../paper/models/paper';

@Component({
  selector: 'app-topic-filter',
  templateUrl: './topic-filter.component.html',
  styleUrls: ['./topic-filter.component.scss']
})
export class TopicFilterComponent implements OnInit {
  @Input() filter: TopicFilter = {};
  @Output() filterChange = new EventEmitter<TopicFilter>();
  
  domains: string[] = Object.values(PaperDomain);
  popularKeywords: string[] = [];
  selectedKeywords: string[] = [];
  dateRanges = [
    { value: DateRange.Week, label: 'Past Week' },
    { value: DateRange.Month, label: 'Past Month' },
    { value: DateRange.Year, label: 'Past Year' },
    { value: DateRange.All, label: 'All Time' }
  ];
  
  isExpanded = false;
  
  constructor(private discoveryService: DiscoveryService) {}
  
  ngOnInit(): void {
    this.loadPopularKeywords();
    
    // Initialize selected keywords if provided in filter
    if (this.filter.keywords) {
      this.selectedKeywords = [...this.filter.keywords];
    }
  }
  
  loadPopularKeywords(): void {
    this.discoveryService.getPopularKeywords().subscribe(keywords => {
      this.popularKeywords = keywords;
    });
  }
  
  toggleKeyword(keyword: string): void {
    const index = this.selectedKeywords.indexOf(keyword);
    if (index === -1) {
      this.selectedKeywords.push(keyword);
    } else {
      this.selectedKeywords.splice(index, 1);
    }
  }
  
  isKeywordSelected(keyword: string): boolean {
    return this.selectedKeywords.includes(keyword);
  }
  
  toggleFilter(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  applyFilters(): void {
    this.filter.keywords = this.selectedKeywords.length > 0 ? [...this.selectedKeywords] : undefined;
    this.filterChange.emit(this.filter);
    this.isExpanded = false;
  }
  
  clearFilters(): void {
    this.filter = {};
    this.selectedKeywords = [];
    this.filterChange.emit(this.filter);
  }
} 