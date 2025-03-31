import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperListComponent } from './pages/paper-list/paper-list.component';
import { PaperDetailComponent } from './pages/paper-detail/paper-detail.component';
import { PaperFormComponent } from './pages/paper-form/paper-form.component';

const routes: Routes = [
  {
    path: '',
    component: PaperListComponent
  },
  {
    path: 'new',
    component: PaperFormComponent
  },
  {
    path: 'edit/:id',
    component: PaperFormComponent
  },
  {
    path: ':id',
    component: PaperDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperRoutingModule { }
