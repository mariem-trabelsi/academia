import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { SystemStatistic } from '../../models/admin.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-system-statistics',
  templateUrl: './system-statistics.component.html',
  styleUrls: ['./system-statistics.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms 150ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class SystemStatisticsComponent implements OnInit {
  statistics: SystemStatistic[] = [];
  
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.adminService.getSystemStatistics().subscribe(stats => {
      this.statistics = stats;
    });
  }
  
  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  }
  
  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  }
  
  getChangePrefix(trend: string): string {
    return trend === 'up' ? '+' : '';
  }
  
  getPeriodLabel(period: string): string {
    switch (period) {
      case 'daily': return 'Last 24 hours';
      case 'weekly': return 'Last 7 days';
      case 'monthly': return 'Last 30 days';
      default: return period;
    }
  }
}
