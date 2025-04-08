import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component';
import { authGuardGuard } from './services/guard/auth-guard.guard';

const routes: Routes = [


  {
    path: 'admin',
    loadChildren: () => import('./module/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuardGuard]
  },

{
  path: '',
  component: AppLayoutComponent,
  children: [

    {
      path: 'papers',
      loadChildren: () => import('./module/paper/paper.module').then(m => m.PaperModule)
    },

    {
      path: 'discover',
      loadChildren: () => import('./module/content-discovery/content-discovery.module').then(m => m.ContentDiscoveryModule)
    },

    {
      path: 'network',
      loadChildren: () => import('./module/social-network/social-network.module').then(m => m.SocialNetworkModule)
    },


    {
      path: 'notifications',
      loadChildren: () => import('./module/notifications/notifications.module').then(m => m.NotificationsModule)
    },

    {
      path: 'feedback',
      loadChildren: () => import('./module/discussion-feedback/discussion-feedback.module').then(m => m.DiscussionFeedbackModule)
    },

    {
      path: '',
      redirectTo: 'discover',
      pathMatch: 'full'
    }
  ]
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
