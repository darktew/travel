import {Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService,
                private route: Router) {
    }
    canActivate(){
        if(this.authService.loggedIn) {
            return true;
        } else {
            this.route.navigate(['/login']);
            return false;
        }
    }
}