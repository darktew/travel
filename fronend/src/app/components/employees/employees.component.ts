import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { NgForm } from '@angular/forms';
import { Employee } from '../../models/employee';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatTableDataSource } from '@angular/material';
declare var M: any;
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {
  show: boolean;
  displayedColumns: string[] = ['name', 'action'];
  searchTerm: string;
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public employeeService: EmployeeService,
              public location: Location,
              private router: Router) {
              }
  ngOnInit() {
    this.getEmployees();
  }
  addEmployee(form: NgForm) {
    if (form.value._id) {
      this.employeeService.putEmployee(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Update Success'});
          this.getEmployees();
          this.show = false;
        });
    } else {
      this.employeeService.postEmployee(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Success'});
        this.getEmployees();
        this.show = false;
      });
    }
  }

  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
        this.dataSource = new  MatTableDataSource(res);
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

  editEmployee(employee: Employee) {
      this.employeeService.selectedEmployee = employee;
  }

  deleteEmployee(_id: string) {
          if (confirm('Are you sure you want to delete it?')) {
            this.employeeService.deleteEmployee(_id)
              .subscribe(res => {
                this.getEmployees();
                M.toast({html: 'Deleted Success'});
              });
        }
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
    this.router.navigate(['/customer/create']);
  }
}

export class EmployeesDataSource implements DataSource<any> {
  constructor(private employee: EmployeeService) {
  }
  connect(): Observable<Employee[]> {
    return this.employee.getEmployees();
  }

  disconnect() {}
}
