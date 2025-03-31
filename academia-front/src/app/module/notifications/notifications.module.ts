import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationCenterComponent } from './pages/notification-center/notification-center.component';
import { NotificationItemComponent } from './components/notification-item/notification-item.component';
import { NotificationSettingsComponent } from './pages/notification-settings/notification-settings.component';
import { NotificationFilterComponent } from './components/notification-filter/notification-filter.component';

@NgModule({
  declarations: [
    NotificationCenterComponent,
    NotificationItemComponent,
    NotificationSettingsComponent,
    NotificationFilterComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NotificationsModule { } 