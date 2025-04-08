import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PaperApprovalQueueComponent } from './components/paper-approval-queue/paper-approval-queue.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ContentModerationComponent } from './components/content-moderation/content-moderation.component';
import { SystemStatisticsComponent } from './components/system-statistics/system-statistics.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { DomainManagementComponent } from './components/domain-management/domain-management.component';
import { ArchivedPapersComponent } from './components/archived-papers/archived-papers.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    PaperApprovalQueueComponent,
    UserManagementComponent,
    ContentModerationComponent,
    SystemStatisticsComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
    DomainManagementComponent,
    ArchivedPapersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
