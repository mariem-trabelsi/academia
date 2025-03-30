import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialNetworkRoutingModule } from './social-network-routing.module';
import { NetworkDashboardComponent } from './pages/network-dashboard/network-dashboard.component';
import { ResearcherProfileComponent } from './pages/researcher-profile/researcher-profile.component';
import { ResearchGroupComponent } from './pages/research-group/research-group.component';
import { MessageCenterComponent } from './pages/message-center/message-center.component';
import { ResearcherCardComponent } from './components/researcher-card/researcher-card.component';
import { UpdateCardComponent } from './components/update-card/update-card.component';
import { FollowSuggestionComponent } from './components/follow-suggestion/follow-suggestion.component';
import { MessageThreadComponent } from './components/message-thread/message-thread.component';
import { GroupCardComponent } from './components/group-card/group-card.component';
import { GroupDetailsComponent } from './pages/group-details/group-details.component';

@NgModule({
  declarations: [
    NetworkDashboardComponent,
    ResearcherProfileComponent,
    ResearchGroupComponent,
    MessageCenterComponent,
    ResearcherCardComponent,
    UpdateCardComponent,
    FollowSuggestionComponent,
    MessageThreadComponent,
    GroupCardComponent,
    GroupDetailsComponent
  ],
  imports: [
    CommonModule,
    SocialNetworkRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SocialNetworkModule { } 