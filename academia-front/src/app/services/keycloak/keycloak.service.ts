import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import {UserProfile} from './userProfile';


@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 'academia',
        clientId: 'academia'
      });
    }
    return this._keycloak;
  }

 private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    console.log("user connecté :" , this._profile)
    return this._profile;
  }

  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
      //onLoad: 'check-sso',
    });

    if (authenticated) {

      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';

    }
  }

  login() {
    return this.keycloak.login();
  }

  logout() {

    return this.keycloak.logout();
  }

  manageAccount() {
    this.keycloak.accountManagement();
  }



  hasRole(role: string): boolean {
    const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
    console.log('User roles:', roles);
    return roles.includes(role);
  }


}
