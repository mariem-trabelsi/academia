import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { Researcher } from '../../models/social';

@Component({
  selector: 'app-researcher-profile',
  templateUrl: './researcher-profile.component.html',
  styleUrls: ['./researcher-profile.component.scss']
})
export class ResearcherProfileComponent implements OnInit {
  researcherId: number = 0;
  researcher: Researcher | null = null;
  publications: any[] = [];
  loading = true;
  activeTab = 'publications';
  
  constructor(
    private route: ActivatedRoute,
    private socialService: SocialService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.researcherId = parseInt(id, 10);
        this.loadResearcherData();
      }
    });
  }
  
  loadResearcherData(): void {
    this.loading = true;
    
    // Get researcher profile
    this.socialService.getResearcherProfile(this.researcherId).subscribe({
      next: (researcher) => {
        this.researcher = researcher;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading researcher:', error);
        this.checkLoading();
      }
    });
    
    // Get researcher publications
    this.socialService.getResearcherPublications(this.researcherId).subscribe({
      next: (publications) => {
        this.publications = publications;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading publications:', error);
        this.checkLoading();
      }
    });
  }
  
  private checkLoading(): void {
    if (this.researcher && this.publications.length >= 0) {
      this.loading = false;
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  followResearcher(): void {
    if (this.researcher) {
      this.researcher.isFollowing = !this.researcher.isFollowing;
      this.researcher.followers += this.researcher.isFollowing ? 1 : -1;
    }
  }
  
  messageResearcher(): void {
    // In a real app, this would redirect to the messaging component
    console.log('Messaging researcher:', this.researcherId);
  }
} 