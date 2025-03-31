import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NetworkDashboardComponent } from './pages/network-dashboard/network-dashboard.component';
import { ResearcherProfileComponent } from './pages/researcher-profile/researcher-profile.component';
import { ResearchGroupComponent } from './pages/research-group/research-group.component';
import { MessageCenterComponent } from './pages/message-center/message-center.component';
import { GroupDetailsComponent } from './pages/group-details/group-details.component';

const routes: Routes = [
  {
    path: '',
    component: NetworkDashboardComponent
  },
  {
    path: 'researcher/:id',
    component: ResearcherProfileComponent
  },
  {
    path: 'group/:id',
    component: GroupDetailsComponent
  },
  {
    path: 'messages',
    component: MessageCenterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialNetworkRoutingModule { } 