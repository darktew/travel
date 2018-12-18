import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from './../../../models/employee';
import { EmployeeService } from './../../../services/employee.service';
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ValidateService } from 'src/app/services/validate.service';
declare var M: any;
@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  providers: [EmployeeService]
})

export class EmployeeCreateComponent implements OnInit {
  _addEmployee: FormGroup;
  title: String;
  constructor(private _formbuilder: FormBuilder,
              public employeeService: EmployeeService,
              private location: Location,
              private dialogRef: MatDialogRef<EmployeeCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private validate: ValidateService) { }

  ngOnInit() {
    this._addEmployee = this._formbuilder.group({
      _id: this.data._id,
      name: [this.data.name, Validators.required],
      phone: [this.data.phone, Validators.required]
    });
    if (this.data._id) {
      this.title = "แก้ไขข้อมูลลูกค้า";
    } else {
      this.title = "เพิ่มข้อมูลลูกค้า";
    }
  }
  onSubmit() {
    const employee = {
      name: this._addEmployee.value.name,
      phone: this._addEmployee.value.phone
    };
    if (!this.validate.validateEmployee(employee)) {
      M.toast({html: 'กรุณากรอกข้อมูลให้ครบ', classes: 'rounded',displayLength: 4000});
      return false;
    }
    if (this.data._id) {
      this.employeeService.putEmployee(this._addEmployee.value)
        .subscribe(res => {
          M.toast({html: 'แก้ไขเสร็จสิ้น'});
          this.dialogRef.close();
        });
    } else {
      this.employeeService.postEmployee(this._addEmployee.value)
      .subscribe(res => {
          M.toast({html: 'เพิ่มข้อมูลเสร็จสิ้น'});
          this.dialogRef.close();
      });
    }
  }
  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
        console.log(res);
      });
  }
  goback(): void {
    this.dialogRef.close();
  }
}
