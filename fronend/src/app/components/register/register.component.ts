import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages/module/flash-messages.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



declare var M:any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ValidateService, AuthService]
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  constructor(private validateService: ValidateService,
              private _flashMessagesService: FlashMessagesService,
              private authService: AuthService,
              private route: Router) { }

  ngOnInit() {
  }
  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    }
    // Required Field
    if(!this.validateService.validateRegister(user)) {
      M.toast({html: 'Plase Form Valid', classes: 'rounded',displayLength: 4000});
      return false;
    }
    // Validate Email 
    if(!this.validateService.validateEmail(user.email)) {
      // this._flashMessagesService.show('Please valid email', { cssClass: 'alert-danger', timeout: 3000 });
      M.toast({html: 'Plase Email Valid', classes: 'rounded',displayLength: 4000});
      return false;
    }
    //Register User
    this.authService.registerUser(user).subscribe(data => {
      if(data.success) {
        M.toast({html: 'You are now registered can log in', classes: 'rounded',displayLength: 4000});
        this.route.navigate(['/login']);
        // this._flashMessagesService.show('You are now registered can log in', { cssClass: 'alert-success', timeout: 3000 });
      } else {
        M.toast({html: 'Something went wrong', classes: 'rounded',displayLength: 4000 });
        this.route.navigate(['/register']);
      }
    });
  }
  
  
}
