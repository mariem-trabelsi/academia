import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoveryPageComponent } from './pages/discovery-page/discovery-page.component';

const routes: Routes = [
  {
    path: '',
    component: DiscoveryPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentDiscoveryRoutingModule { } 