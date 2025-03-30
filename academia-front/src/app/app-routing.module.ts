import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './pages/singin/singin.component';
import { SingnupComponent } from './pages/singnup/singnup.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ArticleTestComponent } from './module/article/pages/article-test/article-test.component';

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
  path: '',
  redirectTo: 'discover',
  pathMatch: 'full'
}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
