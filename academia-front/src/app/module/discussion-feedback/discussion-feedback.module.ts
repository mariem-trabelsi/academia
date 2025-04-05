import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DiscussionFeedbackRoutingModule } from './discussion-feedback-routing.module';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { RatingSummaryComponent } from './components/rating-summary/rating-summary.component';

@NgModule({
  declarations: [
    CommentFormComponent,
    CommentListComponent,
    StarRatingComponent,
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
    CommentFormComponent,
    CommentListComponent,
    StarRatingComponent,
    RatingSummaryComponent
  ]
})
export class DiscussionFeedbackModule { } 