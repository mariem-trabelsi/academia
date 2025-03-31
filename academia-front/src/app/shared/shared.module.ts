import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AppFooterComponent } from './components/app-footer/app-footer.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppLayoutComponent,
    ClickOutsideDirective,
    AppFooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    AppHeaderComponent,
    AppLayoutComponent,
    ClickOutsideDirective,
    AppFooterComponent
  ]
})
export class SharedModule { } 