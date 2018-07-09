import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Employee } from './../../../models/employee';
import { EmployeeService } from './../../../services/employee.service';
import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
declare var M: any;
@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  providers: [EmployeeService]
})

export class EmployeeCreateComponent implements OnInit {

  constructor(public employeeService: EmployeeService,
              private location: Location,
              private dialogRef: MatDialogRef<EmployeeCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }
  addEmployee(form: NgForm) {
    if (this.data._id) {
      form.value._id = this.data._id;
      this.employeeService.putEmployee(form.value)
        .subscribe(res => {
          this.resetForm(form);
          this.getEmployees();
          M.toast({html: 'Update Success'});
          this.dialogRef.close();
        });
    } else {
      this.employeeService.postEmployee(form.value)
      .subscribe(res => {
        this.resetForm(form);
        this.getEmployees();
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
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.employeeService.selectedEmployee = new Employee();
    }
  }
  goback(): void {
    this.dialogRef.close();
  }
}
