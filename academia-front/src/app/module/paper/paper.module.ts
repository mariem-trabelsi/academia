import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaperRoutingModule } from './paper-routing.module';
import { PaperListComponent } from './pages/paper-list/paper-list.component';
import { PaperDetailComponent } from './pages/paper-detail/paper-detail.component';
import { PaperFormComponent } from './pages/paper-form/paper-form.component';
import { PaperCardComponent } from './components/paper-card/paper-card.component';
import { PaperFilterComponent } from './components/paper-filter/paper-filter.component';

@NgModule({
  declarations: [
    PaperListComponent,
    PaperDetailComponent,
    PaperFormComponent,
    PaperCardComponent,
    PaperFilterComponent
  ],
  imports: [
    CommonModule,
    PaperRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PaperModule { }
