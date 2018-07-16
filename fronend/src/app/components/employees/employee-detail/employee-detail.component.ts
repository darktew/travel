import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { PositionService } from '../../../services/position.service';
import { Position } from '../../../models/position';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {
  public employeeId;
  dataSource;
  constructor(private route: ActivatedRoute,
              public positionService: PositionService) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.employeeId = id;
    this.getPositionByEmployeeId();
  }
  getPositionByEmployeeId() {
    this.positionService.getPositionByEmployeeId(this.employeeId)
      .subscribe(resault => {
        console.log(resault);
      });
  }
}
