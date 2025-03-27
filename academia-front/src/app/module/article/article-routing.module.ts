import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ArticleTestComponent } from './pages/article-test/article-test.component';

const routes: Routes = [
  {
    path:'',
    component: MainComponent,
    
    children: [ {

      path: '',
      component: ArticleTestComponent

    }
  ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
