import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ValidateService } from 'src/app/services/validate.service';

declare var M: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('animation', [
      state('show', style({
        width: '100%',
        height: '100%',
        opacity: 1
      })),
      state('hide', style({
        width: '0',
        height: '0',
        opacity: 0
      })),
      transition('show=>hide', animate('0.5s ease-out')),
      transition('hide=>show', animate('1s ease-in'))
    ])
  ]
})
export class ProfileComponent implements OnInit {
  user: Object;
  id: String;
  name: String;
  username: String;
  password: String;
  email: String;
  address: String;
  phone: String;
  img: any;
  show;
  content_page = false;
  constructor(private authService: AuthService,
    private route: Router,
    private validate: ValidateService) { }

  ngOnInit() {
    this.getProfile();
  }
  getProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.id = profile.user._id;
      this.name = profile.user.name;
      this.email = profile.user.email;
      this.password = profile.user.password_check;
      this.username = profile.user.username;
      if (profile.user.address == '' && profile.user.phone == '') {
        this.address = "ที่อยู่";
        this.phone = "เบอร์โทร";
      } else {
        this.address = profile.user.address;
        this.phone = profile.user.phone;
      }
      this.getImage(profile.user.userImage);
    },
      err => {
        console.log(err);
        return false;
      });

  }
  get stateShow() {
    return this.show ? 'show' : 'hide';
  }
  showEdit() {
    this.show = !this.show;
    if (this.content_page == false) {
      this.content_page = true;
    } else {
      this.content_page = false;
    }
  }
  getImage(url) {
    this.authService.getImage(url)
      .subscribe(res => {
        this.img = res.url;
      });
  }
  editUser() {
    let edituser = {
      id: this.id,
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      address: this.address,
      phone: this.phone
    }
    if(!this.validate.validateEditUser(edituser)) {
      M.toast({html: 'โปรดใส่ที่อยู่ และ เบอร์โทร', classes: 'rounded', displayLength: 4000});
      return false;
    } 
      this.authService.editUser(edituser)
      .subscribe(data => {
        if (data.success) {
          M.toast({ html: 'แก้ไขสำเร็จ', classes: 'rounded', displayLength: 4000 });
          this.content_page = false;
          this.show = !this.show;
          this.getProfile();
        } else {
          M.toast({ html: 'ข้อมูลผิดพลาด', classes: 'rounded', displayLength: 4000 });
          return false;
        }
      });
    
  }
}
