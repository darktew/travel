import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from './../../../models/employee';
import { EmployeeService } from './../../../services/employee.service';
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
declare var M: any;
@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  providers: [EmployeeService]
})

export class EmployeeCreateComponent implements OnInit {
  _addEmployee: FormGroup;
  constructor(private _formbuilder: FormBuilder,
              public employeeService: EmployeeService,
              private location: Location,
              private dialogRef: MatDialogRef<EmployeeCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this._addEmployee = this._formbuilder.group({
      _id: this.data._id,
      name: [this.data.name, Validators.required]
    });
  }
  onSubmit() {
    if (this.data._id) {
      this.employeeService.putEmployee(this._addEmployee.value)
        .subscribe(res => {
          M.toast({html: 'Update Success'});
          this.dialogRef.close();
        });
    } else {
      this.employeeService.postEmployee(this._addEmployee.value)
      .subscribe(res => {
          M.toast({html: 'Save Success'});
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
