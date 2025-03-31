import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocialService } from '../../services/social.service';
import { ResearchGroup } from '../../models/social';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  groupId: number = 0;
  group: ResearchGroup | null = null;
  members: any[] = [];
  loading = true;
  activeTab = 'about';
  
  constructor(
    private route: ActivatedRoute,
    private socialService: SocialService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.groupId = parseInt(id, 10);
        this.loadGroupData();
      }
    });
  }
  
  loadGroupData(): void {
    this.loading = true;
    
    // Get group details
    this.socialService.getGroupDetails(this.groupId).subscribe({
      next: (group) => {
        this.group = group;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading group:', error);
        this.checkLoading();
      }
    });
    
    // Get group members
    this.socialService.getGroupMembers(this.groupId).subscribe({
      next: (members) => {
        this.members = members;
        this.checkLoading();
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.checkLoading();
      }
    });
  }
  
  private checkLoading(): void {
    if (this.group && this.members.length >= 0) {
      this.loading = false;
    }
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  joinGroup(): void {
    if (this.group) {
      this.group.isMember = !this.group.isMember;
      this.group.memberCount += this.group.isMember ? 1 : -1;
    }
  }
  
  formatMemberCount(count: number): string {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
}