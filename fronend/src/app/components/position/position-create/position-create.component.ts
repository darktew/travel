import { Position } from './../../../models/position';
import { EmployeeService } from './../../../services/employee.service';
import { PositionService } from './../../../services/position.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../../models/employee';


declare var M: any;
@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.css'],
  providers: [PositionService]
})
export class PositionCreateComponent implements OnInit {
  locationChosen = false;
  _addPosition: FormGroup;
  test: NgForm;
  position: Position;
  @ViewChild('positionForm') positionForm: NgForm;
  constructor(private dialogRef: MatDialogRef<PositionCreateComponent>,
              public positionService: PositionService,
              public employeeService: EmployeeService,
              public _formbuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
              }

    goback(): void {
      this.dialogRef.close();
    }
  ngOnInit() {
   this.getEmployees();
   this.positionService.selectedPosition = this.data;
    console.log(this.positionService.selectedPosition);
  }
  addPosition(form: NgForm) {
    if (this.data._id) {
    console.log(form.value);
      this.positionService.putPosition(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Update Success'});
          this.getPositions();
          this.dialogRef.close();
        });
    } else {
      this.positionService.postPosition(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Success'});
        this.getPositions();
        this.dialogRef.close();
      });
    }
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.positionService.selectedPosition = new Position();
    }
  }
  onChosenLocation(event) {
    this.positionService.selectedPosition.lattitude = event.coords.lat;
    this.positionService.selectedPosition.longtitude = event.coords.lng;
    this.locationChosen = true;
    console.log(event.coords);
  }
  getPositions() {
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
        console.log(res);
      });
  }
  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
        console.log(res);
      });
    }
}

