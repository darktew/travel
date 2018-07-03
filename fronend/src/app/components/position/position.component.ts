import { EmployeeService } from './../../services/employee.service';
import { NgForm } from '@angular/forms/src/directives';
import { Position } from './../../models/position';
import { PositionService } from './../../services/position.service';
import { Component, OnInit } from '@angular/core';
import { Employee } from '../../models/employee';



declare var M: any;


@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
  providers: [PositionService]
})
export class PositionComponent implements OnInit {
  locationChosen = false;
  show: boolean ;
  constructor(public positionService: PositionService,
              public employeeService: EmployeeService
              ) { }
  ngOnInit() {
    this.getPositions();
    this.getEmployees();
  }
  addPosition(form: NgForm) {
    if (form.value._id) {
      this.positionService.putPosition(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Update Success'});
          this.getPositions();
          this.show = false;
        });
    } else {
      this.positionService.postPosition(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Success'});
        this.getPositions();
        this.show = false;
      });
    }
  }
  getPositions() {
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
        console.log(res);
      });
  }
  editPosition(position: Position) {
    this.positionService.selectedPosition = position;
    this.show = true;
  }
  delePosition(_id: string) {
    if (confirm('Are you sure Delete')) {
      this.positionService.deletePosition(_id)
        .subscribe(res => {
          this.getPositions();
          M.toast({html: 'Delete Success'});
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
  }
  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
        console.log(res);
      });
  }
  a(position) {
    console.log(position);
  }
}
