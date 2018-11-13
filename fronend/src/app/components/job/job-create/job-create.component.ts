import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from "../../../../../node_modules/@angular/material";
import { JobService } from "../../../services/job.service";
import { Job } from "../../../models/job";
import { PositionService } from "../../../services/position.service";
import { Position } from "../../../models/position";
import { Employee } from "../../../models/employee";
import { NgForm } from "../../../../../node_modules/@angular/forms";
import { IoService } from 'src/app/services/io.service';
function remove(item: Object, list: Array<Object>) {
  if (list.indexOf(item) !== -1) {
    list.splice(list.indexOf(item), 1);
  }
}

declare var M: any;
@Component({
  selector: "app-job-create",
  templateUrl: "./job-create.component.html",
  styleUrls: ["./job-create.component.css"]
})
export class JobCreateComponent implements OnInit {
  select: Job;
  jobs: Job[];
  employee: Employee;
  currentBox?: Object[];
  dropzone1: Position[] = [];
  detailCheck:boolean = false;
  title: String;
  searchPosition;
  constructor(
    private dialogRef: MatDialogRef<JobCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public jobservice: JobService,
    public positionService: PositionService,
    private socket: IoService
  ) {}

  ngOnInit() {
    this.getJob();
    this.getPosition();
    
    if (this.data._id) {
      this.title = "แก้ไขข้อมูลการจัดส่ง"
      this.select = this.data;
    } else {
      this.title = "เพิ่มข้อมูลการจัดส่ง"
      this.select = new Job();
    }
    
  }
  getJob() {
    this.jobservice.getJobs().subscribe(res => {
      this.jobs = res as Job[];
    });
  }
  getPosition() {
    this.positionService.getPositions().subscribe(res => {
      console.log(res);
      if (this.data._id && !this.data.data) {

        this.positionService.positions = res as Position[];
        this.dropzone1 = this.data.dropzone;
        // Set Dropzone
        let count = 0;
        for (let i = 0; i < this.dropzone1.length; i++) {
          const p_id = this.dropzone1[i]._id;
          for (let j = 0; j < this.positionService.positions.length; j++) {
            if (p_id === this.positionService.positions[j]._id) {
              this.positionService.positions.splice(j, 1);
              count++;
              break;
            }
          }
        }
      } else if(this.data.Id) {
        this.detailCheck = true;
        this.select.jobname = this.data.jobname;
        this.select._id = this.data.Id
        this.positionService.positions = res as Position[];
        this.dropzone1 = this.data.data;
        this.select.status = '';
        let count = 0;
        for (let i = 0; i < this.dropzone1.length; i++) {
          const p_id = this.dropzone1[i]._id;
          for (let j = 0; j < this.positionService.positions.length; j++) {
            if (p_id === this.positionService.positions[j]._id) {
              this.positionService.positions.splice(j, 1);
              count++;
              break;
            }
          }
        }
      } else {
        this.positionService.positions = res as Position[];
      }
    
    });
  }
  goback(): void {
    this.dialogRef.close();
  }
  addJob(form: NgForm) {
    if (this.data._id) {
      // EDIT
      this.jobservice.putjob(form.value).subscribe(res => {
        M.toast({ html: 'Update Success' });
        this.dialogRef.close();
      });
    } else if (this.data.Id) {
      console.log(form.value,'form');
      this.jobservice.putuserJob(form.value).subscribe(res => {
        M.toast({html: 'Add Position Success'});
        this.dialogRef.close();
      })
    } else {
      // CREATE
      console.log(form.value, 'Form Add');
      this.jobservice.postJob(form.value).subscribe(res => {
        M.toast({ html: 'Save Success' });
        this.dialogRef.close();
      });
    }
  }
  move(j: Object[], toList: Object[]): void {
    remove(j, this.positionService.positions);
    remove(j, this.dropzone1);
    toList.push(j);

    // INPUT
    const a = this.dropzone1;
    // this.select = new Job();
    // PROCESS
    // var b = [];
    this.select.address = [];
    this.select.id = [];
    this.select.lattitude = [];
    this.select.longtitude = [];
    console.log('dropzone', a, 'select', this.select);
    for (let i = 0; i < this.dropzone1.length; i++) {
      this.select.address.push(this.dropzone1[i].address);
      this.select.id.push(this.dropzone1[i]._id);
      this.select.lattitude.push(this.dropzone1[i].lattitude);
      this.select.longtitude.push(this.dropzone1[i].longtitude);
    }
    // OUTPUT

    console.log('select :  ', this.select);
  }
}
