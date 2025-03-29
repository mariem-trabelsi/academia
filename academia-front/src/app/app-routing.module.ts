import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './pages/singin/singin.component';
import { SingnupComponent } from './pages/singnup/singnup.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { ArticleTestComponent } from './module/article/pages/article-test/article-test.component';

const routes: Routes = [
  {
    path :'',
    redirectTo: 'articles',
    pathMatch : 'full'
  },
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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
