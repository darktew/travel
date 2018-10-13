import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

declare var M:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  id: String;
  name: String;
  username: String;
  password: String;
  email: String;
  constructor(private authService: AuthService,
    private route: Router) { }

  ngOnInit() {
    this.getProfile();
  }
  getProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.id = profile.user._id;
      this.name = profile.user.name;
      this.username = profile.user.username;
      this.password = profile.user.password_check;
      this.email = profile.user.email;
    },
      err => {
        console.log(err);
        return false;
      });
      
  }
  editUser() {
     let edituser = {
        id: this.id,
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password
      }
      this.authService.editUser(edituser)
          .subscribe(data => {
          if (data.success) {
            M.toast({html: 'แก้ไขสำเร็จ', classes: 'rounded',displayLength: 4000});
            this.getProfile();
          } else {
            M.toast({html: 'ข้อมูลผิดพลาด', classes: 'rounded',displayLength: 4000});
            return false;
          }
          });
  }
}
