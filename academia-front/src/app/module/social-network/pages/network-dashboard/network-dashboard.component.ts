import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService, ResearchUpdate, NetworkStats } from '../../services/social.service';
import { Researcher, ResearchGroup } from '../../models/social';

@Component({
  selector: 'app-network-dashboard',
  templateUrl: './network-dashboard.component.html',
  styleUrls: ['./network-dashboard.component.scss']
})
export class NetworkDashboardComponent implements OnInit {
  networkFeed: ResearchUpdate[] = [];
  allUpdatesFeed: ResearchUpdate[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  hasMoreUpdates = false;
  loadingMore = false;
  suggestedResearchers: Researcher[] = [];
  researchGroups: ResearchGroup[] = [];
  networkStats: NetworkStats | null = null;
  loading = true;
  
  constructor(
    private socialService: SocialService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.loading = true;
    
    // Get network feed
    this.socialService.getNetworkFeed(1, this.itemsPerPage).subscribe({
      next: (updates) => {
        this.networkFeed = updates;
        this.hasMoreUpdates = updates.length === this.itemsPerPage;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading network feed:', error);
        this.checkLoading();
      }
    });
    
    // Get suggested researchers
    this.socialService.getSuggestedResearchers().subscribe({
      next: (researchers) => {
        this.suggestedResearchers = researchers;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading suggested researchers:', error);
        this.checkLoading();
      }
    });
    
    // Get research groups
    this.socialService.getResearchGroups().subscribe({
      next: (groups) => {
        this.researchGroups = groups;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading research groups:', error);
        this.checkLoading();
      }
    });
    
    // Get network stats
    this.socialService.getNetworkStats().subscribe({
      next: (stats) => {
        this.networkStats = stats;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading network stats:', error);
        this.checkLoading();
      }
    });
  }
  
  private checkLoading(): void {
    // Check if all data is loaded
    if (this.networkFeed.length > 0 && 
        this.suggestedResearchers.length > 0 && 
        this.researchGroups.length > 0 && 
        this.networkStats) {
      this.loading = false;
    }
  }
  
  viewResearcher(id: number): void {
    this.router.navigate(['/network/researcher', id]);
  }
  
  messageResearcher(id: number): void {
    this.router.navigate(['/network/messages'], { queryParams: { user: id } });
  }
  
  viewGroup(id: number): void {
    this.router.navigate(['/network/group', id]);
  }
  
  openMessages(): void {
    this.router.navigate(['/network/messages']);
  }
  
  likeUpdate(update: ResearchUpdate): void {
    update.isLiked = !update.isLiked;
    update.likes += update.isLiked ? 1 : -1;
  }
  
  followResearcher(researcher: Researcher): void {
    this.socialService.followResearcher(researcher.id).subscribe({
      next: () => {
        console.log(`${researcher.isFollowing ? 'Unfollowed' : 'Followed'} researcher: ${researcher.name}`);
      },
      error: (error) => {
        console.error('Error following researcher:', error);
      }
    });
  }
  
  joinGroup(group: ResearchGroup): void {
    this.socialService.joinGroup(group.id).subscribe({
      next: () => {
        console.log(`${group.isMember ? 'Left' : 'Joined'} group: ${group.name}`);
      },
      error: (error) => {
        console.error('Error joining group:', error);
      }
    });
  }

  loadMoreUpdates(): void {
    if (this.loadingMore || !this.hasMoreUpdates) return;

    this.loadingMore = true;
    this.currentPage++;

    this.socialService.getNetworkFeed(this.currentPage, this.itemsPerPage).subscribe({
      next: (updates) => {
        this.networkFeed = [...this.networkFeed, ...updates];
        this.hasMoreUpdates = updates.length === this.itemsPerPage;
        this.loadingMore = false;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading more updates:', error);
        this.loadingMore = false;
        this.checkLoading();
      }
    });
  }
} 