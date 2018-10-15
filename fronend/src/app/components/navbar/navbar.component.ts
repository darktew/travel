import { Component, OnInit, ViewChildren, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { trigger, state, animate, transition, style, group, query } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { UploadsComponent } from '../uploads/uploads.component';

declare var M: any;
export interface Tile {
  cols: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('1 => 2, 2=>1', [
        style({ height: '!' }),
        query(':enter', style({ transform: 'translateX(100%)' })),
        query(':enter, :leave', style({ position: 'absolute', right: 0, left: 0 })),
        group([
          query(':leave', [
            animate('0.4s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(100%)' }))
          ]),
          query(':enter', [
            animate('0.7s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0%)' }))
          ])
        ])
      ]),
      transition('1=>3, 3=>1', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('3=>4, 4=>3', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('3=>5, 5=>3', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('4=>5, 5=>4', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('6=>5, 5=>6', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('6=>4, 4=>6', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ]),
      transition('6=>3, 3=>6', [
        style({ opacity: 0 }),
        animate('0.5s linear')
      ])
    ])
  ],

})

export class NavbarComponent implements OnInit {
  opened: boolean = false;
  fixed_action: any;
  selectFile: File = null;
  user: Object;
  email: String;
  isPopupOpened = true;
  img: any;
  constructor(private authService: AuthService,
    private route: Router,
    private dialog?: MatDialog
  ) {
  }
  ngOnInit() {
    this.getProfile();
    this.dropdown();
  }
  getProfile() {
      this.authService.getProfile().
        subscribe(profile => {
          this.user = profile.user;
          this.email = profile.user.email;
          this.getImage(profile.user.userImage);
        });
    
  }
  getImage(url) {
    this.authService.getImage(url)
      .subscribe(res => {
        this.img = res.url;
      });

  }
  open() {
    this.opened = true;
  }
  onLogoutClick() {
    this.authService.logout();
    M.toast({ html: 'You are log out', classes: 'rounded', displayLength: 3000 });
    this.route.navigate(['/login']);
    return false;
  }
  getDept(outlet) {
    return outlet.activatedRouteData['depth'];
  }
  dropdown() {
    document.addEventListener('DOMContentLoaded', function () { 
      var elems = document.querySelectorAll('.dropdown-trigger');
      var instances = M.Dropdown.init(elems, {
        stopPropagation: false
      });
    });
    
  }
  chageImage() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(UploadsComponent, {
      width: '450px',
      height: '500px',
      data: this.user
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getProfile();
    });
  }

};
