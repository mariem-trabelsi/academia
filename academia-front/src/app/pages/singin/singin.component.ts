import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/services/models';
import { AuthenticationService } from 'src/app/services/services';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.scss']
})
export class SinginComponent {
  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(private route : Router, private authService : AuthenticationService){

  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    })
    .subscribe({
      next: (res) => {
        console.log(res.token)
       // suavgarder token
        
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.errorMsg);
        }
      }
    });
  }


  register(){
    this.route.navigate(['register']);
    console.log()
  }
}
