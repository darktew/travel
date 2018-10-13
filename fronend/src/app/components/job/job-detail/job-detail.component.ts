import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource, MatDialog, TooltipPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SortEvent } from '../../../draggale/sortable-list.directive';
import { NgForm } from '@angular/forms';
import { JobCreateComponent } from '../job-create/job-create.component';
declare var M: any;
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JobDetailComponent implements OnInit {
  position: TooltipPosition[] = ['right']
  job: Job[];
  dis: any;
  dropzone: any;
  zoom: any;
  selectJob: Job;
  sorts: boolean;
  id_param: any;
  isPopupOpened = false;
  time: String;
  total: Number;
  distance: Array<String> = [];
  duration: Array<String> = [];
  text_distance: Array<String> = [];
  text_duration: Array<String> = [];
  public origin: any;
  public destination: any;
  public waypoints: any;
  word: any = [];
  constructor(
    private jobService: JobService,
    public route: ActivatedRoute,
    public location: Location,
    private dialog?: MatDialog,
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getJobdetail(id);
    this.zoom = 7;
    this.selectJob = new Job();
    this.sorts = true;
    this.id_param = id;
  }
  AddJob() {
    this.isPopupOpened = true;
    this.sorts = true;
    const dialogRef = this.dialog.open(JobCreateComponent, {
      width: '1000px',
      height: '500px',
      data: {
        data: this.dropzone,
        Id: this.id_param,
        jobname: this.selectJob.jobname
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.sorts = false;
    });
  }
  goback() {
    this.location.back();
    this.sorts = false;
  }
  disablelist() {
    if (this.sorts == true) {
      this.sorts = false;
    } else {
      this.sorts = true;
    }
  }
  cancel() {
    if (this.sorts == true) {
      this.sorts = false;
    } else {
      this.sorts = true;
    }
  }
  getJobdetail(id) {
    this.job = [];
    this.waypoints = [];
    this.jobService.getJob(id)
      .subscribe(res => {
        var test: any = res as Job[];
        this.job.push(test);
        console.log(this.job);
        for (let j = 0; j < this.job.length; j++) {
          this.dropzone = this.job[j].dropzone;
          this.dis = this.job[j].dis;
          this.time = this.job[j].time;
          this.total = this.job[j].total;
        }
          this.origin = { 
            lat: this.dis[0].lattitude, 
            lng: this.dis[0].longtitude 
          };
          this.destination = { 
            lat: this.dis[this.dis.length - 1].lattitude, 
            lng: this.dis[this.dis.length - 1].longtitude
           };
        for (let b = 1; b < this.dis.length - 1; b++) {
          this.waypoints.push({
            location: { lat: this.dis[b].lattitude, lng: this.dis[b].longtitude },
            stopover: true
          });
          this.distance.push(this.dis[b].distance.text);
          this.duration.push(this.dis[b].duration.text);
        }
        var char = this.genCharArray('a', 'z');
        for(let c = 0; c < this.dis.length; c++) {
          this.word.push(char[c].toUpperCase());
        }

        for (let w = 0; w < this.word.length; w++) {
          if (this.word[w+1] != undefined) {
            this.text_distance.push("จากจุด " + this.word[w] + " ถึงจุด " + this.word[w+1] + " มีระยะทาง " + this.dis[w+1].distance.text);
          } else {
            this.text_distance = this.text_distance;
          }
          if (this.dis[w+1] != undefined) {
            this.text_duration.push(" ใช้เวลา "+this.dis[w+1].duration.text);
          } else {
            this.text_duration = this.text_duration;
          }
        }
        console.log("distance",this.text_distance);
        console.log(this.text_distance);
        this.selectJob._id = this.id_param;
        this.selectJob.jobname = this.job[0].jobname;
      });

  }
  sort(event: SortEvent) {
    const current = this.job[0].dis[event.currentIndex];
    const swapWith = this.job[0].dis[event.newIndex];
    this.job[0].dis[event.currentIndex] = swapWith;
    this.job[0].dis[event.newIndex] = current;
    this.selectJob.address = [];
    this.selectJob.id = [];
    this.selectJob.lattitude = [];
    this.selectJob.longtitude = [];
    for (let i = 0; i < this.dis.length; i++) {
      this.selectJob.address.push(this.dis[i].address);
      this.selectJob.id.push(this.dis[i].id);
      this.selectJob.lattitude.push(this.dis[i].lattitude);
      this.selectJob.longtitude.push(this.dis[i].longtitude);
    }
    
  }
  editJobByUser(form: NgForm) {
 
    this.jobService.putuserJob(form.value)
      .subscribe(res => {
        M.toast({ html: "Job Update Success" });
        //  window.location.reload();
        this.getJobdetail(this.id_param);
        this.sorts = true;
      });
  }
  genCharArray(charA, charZ) {
    var a = [], i = charA.charCodeAt(0), j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
      a.push(String.fromCharCode(i));
    }
    return a;
  }
}
