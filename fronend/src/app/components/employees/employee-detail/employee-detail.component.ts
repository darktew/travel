import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { PositionService } from '../../../services/position.service';
import { Position } from '../../../models/position';
import { MatTableDataSource } from '@angular/material';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee';
import { Observable } from '../../../../../node_modules/rxjs';



@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  providers: [PositionService,
              EmployeeService]
})
export class EmployeeDetailComponent implements OnInit {
  public employeeId;
  employee: Array<Object>;
  dataSource;
  constructor(private route: ActivatedRoute,
              public positionService: PositionService,
              public employeeService: EmployeeService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.employeeId = id;
    this.getPositionByEmployeeId();
  }
  getPositionByEmployeeId() {
    this.positionService.getPositionByEmployeeId(this.employeeId)
      .subscribe(resault => {
        this.positionService.positions = resault as Position[];
        console.log(resault);
      });
    this.employeeService.getEmployee(this.employeeId)
    .subscribe(res => {
      this.employee = res as Employee[];
      console.log(this.employee);
    });
  }
}
