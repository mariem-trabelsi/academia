import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SinginComponent } from './pages/singin/singin.component';
import { SingnupComponent } from './pages/singnup/singnup.component';
import { FormsModule } from '@angular/forms';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { CodeInputModule } from 'angular-code-input';
import { TokenInjectionInterceptor } from './services/interceptor/token-injection.interceptor';
import { ArticleTestComponent } from './module/article/pages/article-test/article-test.component';
import { SharedModule } from './shared/shared.module';
import { DiscussionFeedbackModule } from './module/discussion-feedback/discussion-feedback.module';
import { KeycloakService } from './services/keycloak/keycloak.service';


export function keyclockFactory(kcService: KeycloakService) {
  return () => kcService.init();
}


@NgModule({
  declarations: [
    AppComponent,
    SinginComponent,
    SingnupComponent,
    ActivateAccountComponent,
    ArticleTestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule,
    SharedModule,
    DiscussionFeedbackModule
  ],
  providers: [
    HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInjectionInterceptor,
      multi: true
   },

   {
    provide: APP_INITIALIZER,
    deps: [KeycloakService],
    useFactory: keyclockFactory,
    multi: true
   }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
