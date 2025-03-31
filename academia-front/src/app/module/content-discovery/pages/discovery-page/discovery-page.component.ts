import { Component, OnInit } from '@angular/core';
import { DiscoveryService } from '../../services/discovery.service';
import { Paper } from '../../../paper/models/paper';
import { DiscoveryData, TopicFilter } from '../../models/discovery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discovery-page',
  templateUrl: './discovery-page.component.html',
  styleUrls: ['./discovery-page.component.scss']
})
export class DiscoveryPageComponent implements OnInit {
  discoveryData: DiscoveryData = {
    recommendedPapers: [],
    trendingPapers: [],
    latestPapers: [],
    relatedPapers: []
  };
  filter: TopicFilter = {};
  loading = true;
  activeSection = 'recommended';

  constructor(
    private discoveryService: DiscoveryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDiscoveryData();
  }

  loadDiscoveryData(): void {
    this.loading = true;
    this.discoveryService.getDiscoveryData(this.filter).subscribe({
      next: (data) => {
        this.discoveryData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading discovery data:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(filter: TopicFilter): void {
    this.filter = filter;
    this.loadDiscoveryData();
  }

  viewPaper(paperId: number | undefined): void {
    if (paperId !== undefined) {
      this.router.navigate(['/papers', paperId]);
    }
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
} 