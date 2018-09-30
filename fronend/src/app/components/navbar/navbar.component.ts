import { Component, OnInit, ViewChildren, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, animate, transition, style} from '@angular/animations';


declare var M:any;
declare var jquery:any;
declare var $:any;
export interface Tile {
  cols: number;
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('bounce', [
      transition('void => *', [
        style({backgroundColor: 'white', opacity: 0}),
        animate(2000)
      ]),
      transition('* => void', [
        style({backgroundColor: 'white', opacity: 0}),
        animate(2000)
      ])
    ]) 
  ]
})
export class NavbarComponent implements OnInit {
  opened:boolean = false;
  fixed_action:any;
  constructor(private authService: AuthService,
    
              private route: Router) { }
  ngOnInit() { 
    this.focusme();
  }
  focusme() {
  
    var elems = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(elems, {
      direction: 'left'
    });
  }
  show_profile(event) {
    console.log(event);
  }
  open() {
    this.opened = true;
  }
  onLogoutClick() {
    this.authService.logout();
    
    M.toast({html: 'You are log out'});
    this.route.navigate(['/login']);
    return false;
  }
}
