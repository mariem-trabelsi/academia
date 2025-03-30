import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { PaperApproval } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-paper-approval-queue',
  templateUrl: './paper-approval-queue.component.html',
  styleUrls: ['./paper-approval-queue.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class PaperApprovalQueueComponent implements OnInit {
  papers: PaperApproval[] = [];
  selectedPaper: PaperApproval | null = null;
  rejectionReason: string = '';
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPapers();
  }

  loadPapers(): void {
    this.adminService.getPaperApprovalQueue().subscribe(papers => {
      this.papers = papers;
    });
  }

  viewPaperDetails(paper: PaperApproval): void {
    this.selectedPaper = paper;
    this.rejectionReason = '';
  }

  closePaperDetails(): void {
    this.selectedPaper = null;
    this.rejectionReason = '';
  }

  approvePaper(paper: PaperApproval): void {
    this.adminService.approvePaper(paper.id).subscribe(() => {
      this.loadPapers();
      this.closePaperDetails();
    });
  }

  rejectPaper(paper: PaperApproval): void {
    if (this.rejectionReason) {
      this.adminService.rejectPaper(paper.id, this.rejectionReason).subscribe(() => {
        this.loadPapers();
        this.closePaperDetails();
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }
}
