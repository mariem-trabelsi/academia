import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationCenterComponent } from './pages/notification-center/notification-center.component';
import { NotificationSettingsComponent } from './pages/notification-settings/notification-settings.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationCenterComponent
  },
  {
    path: 'settings',
    component: NotificationSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { } 