import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job';
import { PositionService } from '../../../services/position.service';
import { Position } from '../../../models/position';
import { Employee } from '../../../models/employee';
import { NgForm } from '../../../../../node_modules/@angular/forms';

function remove(item: Array<Object>, list: Array<Object>) {
  if (list.indexOf(item) !== -1) {
    list.splice(list.indexOf(item), 1);
  }
}
declare var M: any;
@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css'],
})
export class JobCreateComponent implements OnInit {
  select: Job;
  jobs: Job[];
  employee: Employee;
  currentBox?: Object[];
  dropzone1: Job[] = [];
  constructor(private dialogRef: MatDialogRef<JobCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public jobservice: JobService,
    public positionService: PositionService
    ) { }

  ngOnInit() {
    this.select = this.data;
    this.getPosition();
    this.getJob();
  }
  getJob() {
    this.jobservice.getJobs()
      .subscribe(res => {
        this.jobs = res as Job[];

      });
  }
  getPosition() {
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
      });
  }
  goback(): void {
    this.dialogRef.close();
  }
  addJob(form: NgForm) {
    if (this.select._id) {
      this.jobservice.putjob(form.value)
          .subscribe(res => {
          M.toast({html: 'Update Success'});
          this.dialogRef.close();
          });
    } else {
      console.log(form.value);
      this.jobservice.postJob(form.value)
        .subscribe(res => {
          M.toast({html: 'Save Success'});
          this.dialogRef.close();
        });
    }
  }
  move(j: Object[], toList: Object[]): void {
    remove(j, this.positionService.positions);
    remove(j, this.dropzone1);
    toList.push(j);
    console.log(toList);


    //INPUT    
    this.select = new Job();
    var a = this.dropzone1;
    
    //PROCESS
    //var b = [];
    console.log("dropzone",a,this.select);
    for (var i = 0; i < a.length; i++) {
      this.select.address.push(a[i].address);
      this.select.id.push(a[i]._id);
      this.select.lattitude.push(a[i].lattitude);
      this.select.longtitude.push(a[i].longtitude);
      // this.select.address.push(a[i].address);
      // this.select.address.push(a[i].address);
    }
    //OUTPUT
    var z = [
      "1", "2", "3"
    ];
    console.log("select :  ", this.select);
  }
}
