import { Component } from '@angular/core';
import {KeycloakService} from "../../../../services/keycloak/keycloak.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  isAdmin = false;

  constructor(
    private keycloakService: KeycloakService
  )
   {
    this.checkAdminRole();
  }

  
 

  checkAdminRole() {
    this.isAdmin = this.keycloakService.hasRole('ADMIN'); 
  }


  async logout() {
    await this.keycloakService.logout();
  }
  profile(){
    this.keycloakService.manageAccount();
  }
}
