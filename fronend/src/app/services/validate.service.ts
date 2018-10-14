import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if(user.name == undefined && user.username == undefined && user.email == undefined && user.password == undefined && user.password_check == undefined) {
      return false;
    } else {
      return true;
    }
  }
  validatePassword(user) {
    if(user.password == user.password_check) {
      return true;
    } else {
      return false;
    }
  }
  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validateEmployee(employee) {
    if(employee.name == undefined && employee.phone == undefined) {
      return false; 
    } else {
      return true;
    }
  }
  validateAddress(address) {
    if(address.address == undefined) {
      return false;
    } else {
      return true;
    }
  }
}
