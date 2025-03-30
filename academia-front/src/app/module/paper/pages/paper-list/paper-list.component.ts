import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paper, PaperFilter } from '../../models/paper';
import { PaperService } from '../../services/paper.service';

@Component({
  selector: 'app-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit {
  papers: Paper[] = [];
  loading = false;
  filter: PaperFilter = {};
  confirmingDeleteId: number | null = null;

  constructor(
    private paperService: PaperService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPapers();
  }

  loadPapers(): void {
    this.loading = true;
    this.paperService.getPapers(this.filter).subscribe({
      next: (papers) => {
        this.papers = papers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading papers:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(filter: PaperFilter): void {
    this.filter = filter;
    this.loadPapers();
  }

  onDeleteRequest(id: number): void {
    this.confirmingDeleteId = id;
  }

  confirmDelete(): void {
    if (this.confirmingDeleteId) {
      this.paperService.deletePaper(this.confirmingDeleteId).subscribe({
        next: (success) => {
          if (success) {
            this.papers = this.papers.filter(p => p.id !== this.confirmingDeleteId);
          }
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting paper:', error);
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  createNewPaper(): void {
    this.router.navigate(['/papers/new']);
  }
}
