import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentDiscoveryRoutingModule } from './content-discovery-routing.module';
import { DiscoveryPageComponent } from './pages/discovery-page/discovery-page.component';
import { TopicFilterComponent } from './components/topic-filter/topic-filter.component';
import { RecommendedPaperComponent } from './components/recommended-paper/recommended-paper.component';
import { TrendingListComponent } from './components/trending-list/trending-list.component';
import { LatestArticlesComponent } from './components/latest-articles/latest-articles.component';
import { RouterModule } from '@angular/router';
import { DiscussionFeedbackModule } from '../discussion-feedback/discussion-feedback.module';

@NgModule({
  declarations: [
    DiscoveryPageComponent,
    TopicFilterComponent,
    RecommendedPaperComponent,
    TrendingListComponent,
    LatestArticlesComponent
  ],
  imports: [
    CommonModule,
    ContentDiscoveryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DiscussionFeedbackModule
  ],
  exports: [
    RecommendedPaperComponent,
    TopicFilterComponent,
    TrendingListComponent,
    LatestArticlesComponent
  ]
})
export class ContentDiscoveryModule { } 