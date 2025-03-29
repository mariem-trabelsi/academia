import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CodeInputModule
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
