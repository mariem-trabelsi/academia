import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { DashboardSummary } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms 150ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class AdminDashboardComponent implements OnInit {
  dashboardSummary: DashboardSummary | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardSummary();
  }

  loadDashboardSummary(): void {
    this.adminService.getDashboardSummary().subscribe((summary) => {
      this.dashboardSummary = summary;
    });
  }
}
