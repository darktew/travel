import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


declare var M:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  constructor(private authService: AuthService,
              private route: Router) { }

  ngOnInit() {
  }
  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };
    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success) {
        this.authService.storeUserData(data.token,data.user);
        M.toast({html: 'You are log in', classes: 'rounded',displayLength: 4000 });
        this.route.navigate(['/home']);
      } else {
        M.toast({html: data.msg, classes: 'rounded',displayLength: 4000 });
        this.route.navigate(['/login']);
      };
    });
  }
}
