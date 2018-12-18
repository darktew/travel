import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { PositionService } from '../../../services/position.service';
import { Position } from '../../../models/position';
import { MatTableDataSource, MatDialog, TooltipPosition } from '@angular/material';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee';
import { Observable } from '../../../../../node_modules/rxjs';
import { PositionCreateComponent } from '../../position/position-create/position-create.component';
import { Location } from '@angular/common';

declare var M:any;
@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  providers: [PositionService,
              EmployeeService]
})
export class EmployeeDetailComponent implements OnInit {
  public employeeId;
  tooltip: TooltipPosition[]  = ['left'];
  isPopupOpened = false;
  employee: Array<Object>;
  dataSource;
  name:any;
  zoom = 6;
  constructor(private route: ActivatedRoute,
              public positionService: PositionService,
              public employeeService: EmployeeService,
              private location: Location,
              private dialog?: MatDialog) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.employeeId = id;
    this.getPositionByEmployeeId();
    this.tooltib();
  }
  goback() {
    this.location.back();
  }
  getPositionByEmployeeId() {
    this.positionService.getPositionByEmployeeId(this.employeeId)
      .subscribe(resault => {
        this.positionService.positions = resault as Position[];
        console.log(resault);
      });
    this.employeeService.getEmployee(this.employeeId)
    .subscribe(res => {
      this.employeeService.employees = res as Employee[];
      this.name = this.employeeService.employees["name"];
    });
  }
  showAddPosition() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(PositionCreateComponent, {
      data: {pageID : this.employeeId}
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isPopupOpened = false;
      this.getPositionByEmployeeId();
    });
  }
  editPosition(position: Position) {
    this.positionService.selectedPosition = position;
    console.log(this.positionService.selectedPosition);
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(PositionCreateComponent, {
      data: this.positionService.selectedPosition
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isPopupOpened = false;
      this.getPositionByEmployeeId();
    });
  }
  delePosition(_id: string) {
    if (confirm('คุณต้องการลบที่อยู่นี้หรือไม่')) {
      this.positionService.deletePosition(_id)
        .subscribe(res => {
          this.getPositionByEmployeeId()
          M.toast({html: 'ลบข้อมูลเสร็จสิ้น'});
        });
    }
  }
  tooltib() {
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.tooltipped');
      var instances = M.Tooltip.init(elems);
    });
  }
}
