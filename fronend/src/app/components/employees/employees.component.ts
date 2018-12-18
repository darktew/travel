import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { NgForm } from '@angular/forms';
import { Employee } from '../../models/employee';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatTableDataSource, MatDialog, TooltipPosition } from '@angular/material';
import { EmployeeCreateComponent } from './employee-create/employee-create.component';
import { PositionService } from 'src/app/services/position.service';
declare var M: any;
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {
  isPopupOpened = false;
  tooltip: TooltipPosition[] = ['left'];
  show: boolean;
  displayedColumns: string[] = ['name', 'phone', 'action'];
  searchTerm: string;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public employeeService: EmployeeService,
    public position: PositionService,
    public location: Location,
    private router: Router,
    private dialog?: MatDialog,
  ) {
  }
  ngOnInit() {
    this.getEmployees();
  }
  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        console.log(res);
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(_id: string) {
    if (confirm('Are you sure you want to delete it?')) {
      this.position.deleteAllPosition(_id)
        .subscribe(res => {
          console.log(res);
      });
      this.employeeService.deleteEmployee(_id)
        .subscribe(res => {
          this.getEmployees();
          M.toast({ html: 'Deleted Success' });
        });
    }
  }
  updateEmployee(employee: Employee) {
    this.isPopupOpened = true;
    this.employeeService.selectedEmployee = employee;
    const dialogRef = this.dialog.open(EmployeeCreateComponent, {
      width: '500px',
      height: '400px',
      data: this.employeeService.selectedEmployee
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getEmployees();
    });
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.employeeService.selectedEmployee = new Employee();
    }
  }
  goback() {
    this.location.back();
  }
  showAddEmployee() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(EmployeeCreateComponent, {
      width: '500px',
      height: '400px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getEmployees();
    });
  }
  onSelect(element) {
    this.router.navigate(['/customer', element._id]);
  }
}

export class EmployeesDataSource implements DataSource<any> {
  constructor(private employee: EmployeeService) {
  }
  connect(): Observable<Employee[]> {
    return this.employee.getEmployees();
  }

  disconnect() { }
}
