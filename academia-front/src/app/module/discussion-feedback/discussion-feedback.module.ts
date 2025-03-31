import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DiscussionFeedbackRoutingModule } from './discussion-feedback-routing.module';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { RatingSummaryComponent } from './components/rating-summary/rating-summary.component';

@NgModule({
  declarations: [
    StarRatingComponent,
    CommentListComponent,
    CommentFormComponent,
    RatingSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DiscussionFeedbackRoutingModule
  ],
  exports: [
    StarRatingComponent,
    CommentListComponent,
    CommentFormComponent,
    RatingSummaryComponent
  ]
})
export class DiscussionFeedbackModule { } 