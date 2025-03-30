import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// No specific pages for this module yet as the components will be used in other feature modules

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussionFeedbackRoutingModule { } 