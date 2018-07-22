import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job';
import { PositionService } from '../../../services/position.service';
import { Position } from '../../../models/position';

function remove(item: Array<Object>, list: Array<Object>) {
  if (list.indexOf(item) !== -1) {
    list.splice(list.indexOf(item), 1);
  }
}

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css'],
})
export class JobCreateComponent implements OnInit {
  select: Job;
  jobs: Job[];
  currentBox?: Object[];
  constructor(private dialogRef: MatDialogRef<JobCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public jobservice: JobService,
              public positionService: PositionService) { }

  ngOnInit() {
    this.select = this.data;
    this.getPosition();
    this.getJob();
  }
  getJob() {
    this.jobservice.getJobs()
      .subscribe(res => {
        this.jobs = res as Job[];
        console.log(this.jobs);
      });
  }
  getPosition(){
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
        console.log(this.positionService.positions);
      });
  }
  goback(): void {
    this.dialogRef.close();
  }
  // onDragStart(): void {
  //   console.log('got drag start');
  // }
  // onDragMove(event: PointerEvent): void {
  //   console.log(`got drag move ${Math.round(event.clientX)} ${Math.round(event.clientY)}`);
  // }
  // onDragEnd(): void {
  //   console.log('got drag end');
  // }
  move(j: Object[], toList: Object[]): void{
    remove(j, this.positionService.positions);
    remove(j, this.jobs);
    toList.push(j);
  }
}
