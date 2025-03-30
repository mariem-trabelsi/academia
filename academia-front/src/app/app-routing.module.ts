import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './pages/singin/singin.component';
import { SingnupComponent } from './pages/singnup/singnup.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ArticleTestComponent } from './module/article/pages/article-test/article-test.component';
import { AppLayoutComponent } from './shared/components/app-layout/app-layout.component';

const routes: Routes = [
 { 
   path :'login', 
   component :  SinginComponent,
 },

 { 
  path:'register', 
  component: SingnupComponent
},

{
  path: 'activate-account',
  component: ActivateAccountComponent
},

/*{
  path: 'home',
  component: ArticleTestComponent
},*/

{
  path: 'admin',
  loadChildren: () => import('./module/admin/admin.module').then(m => m.AdminModule)
},

{
  path: '',
  component: AppLayoutComponent,
  children: [
    {
      path: 'articles',
      loadChildren: () => import('./module/article/article.module').then(m => m.ArticleModule)
    },
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
