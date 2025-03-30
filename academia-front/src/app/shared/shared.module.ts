import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppLayoutComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AppHeaderComponent,
    AppLayoutComponent,
    ClickOutsideDirective
  ]
})
export class SharedModule { } 