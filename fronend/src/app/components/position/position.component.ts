import { PositionCreateComponent } from './position-create/position-create.component';
import { EmployeeService } from './../../services/employee.service';
import { NgForm } from '@angular/forms/src/directives';
import { Position } from './../../models/position';
import { PositionService } from './../../services/position.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from '../../models/employee';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';



declare var M: any;


@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
  providers: [PositionService]
})
export class PositionComponent implements OnInit {
  isPopupOpened = false;
  locationChosen = false;
  show: boolean ;
  displayedColumns: string[] = ['address', 'name', 'action'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public positionService: PositionService,
              public employeeService: EmployeeService,
              private dialog?: MatDialog
              ) { }
  ngOnInit() {
    this.getPositions();
  }
  showAddPosition() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(PositionCreateComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isPopupOpened = false;
      this.getPositions();
    });
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
        this.dataSource = new  MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.show = false;
        console.log(res);
        console.log("MatTableSource : ",res);
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.dataSource.filterPredicate = (data, filter) => {
      const dataStr = data.name + data.employee.name;
      return dataStr.indexOf(filter) != -1; 
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  editPosition(position: Position) {
    this.positionService.selectedPosition = position;
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(PositionCreateComponent, {
      width: '1000px',
      data: this.positionService.selectedPosition
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isPopupOpened = false;
      this.getPositions();
    });
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
}
