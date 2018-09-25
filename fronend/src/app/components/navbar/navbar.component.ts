import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


declare var M:any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
              private route: Router) { }

  ngOnInit() {
  }
  onLogoutClick() {
    this.authService.logout();
    M.toast({html: 'You are log out'});
    this.route.navigate(['/login']);
    return false;
  }
}
