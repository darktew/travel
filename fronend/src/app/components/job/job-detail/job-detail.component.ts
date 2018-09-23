import { Component, OnInit } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SortEvent } from '../../../draggale/sortable-list.directive';
import { NgForm } from '@angular/forms';
declare var M: any;
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: Job[];
  dis: any;
  dropzone: any;
  zoom: any;
  selectJob: Job;
  sorts: boolean;
  id_param: any;
  public origin: any;
  public destination: any;
  public waypoints: any;
  constructor(
    private jobService: JobService,
    public route: ActivatedRoute,
    public location: Location
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getJobdetail(id);
    this.zoom = 7;
    this.selectJob = new Job();
    this.sorts = true;
    this.id_param = id;
  }
  goback() {
    this.location.back();
  }
  disablelist() {
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
        }
        for (let k = 0; k < this.dis.length; k++) {
          this.origin = { lat: this.dis[0].lattitude, lng: this.dis[0].longtitude };
          this.destination = { lat: this.dis[this.dis.length - 1].lattitude, lng: this.dis[this.dis.length - 1].longtitude };
        }
        for (let b = 1; b < this.dis.length - 1; b++) {
          this.waypoints.push({
            location: { lat: this.dis[b].lattitude, lng: this.dis[b].longtitude },
            stopover: true
          });
        }
        this.selectJob._id = this.id_param;
        this.selectJob.jobname = this.job[0].jobname;
      });
    
  }
  sort(event: SortEvent) {
    const current = this.job[0].dropzone[event.currentIndex];
    const swapWith = this.job[0].dropzone[event.newIndex];
    this.job[0].dropzone[event.currentIndex] = swapWith;
    this.job[0].dropzone[event.newIndex] = current;
    this.selectJob.address = [];
    this.selectJob.id = [];
    this.selectJob.lattitude = [];
    this.selectJob.longtitude = [];
    for (let i = 0; i < this.dropzone.length; i++) {
      this.selectJob.address.push(this.dropzone[i].address);
      this.selectJob.id.push(this.dropzone[i]._id);
      this.selectJob.lattitude.push(this.dropzone[i].lattitude);
      this.selectJob.longtitude.push(this.dropzone[i].longtitude);
    }
  }
  editJobByUser(form: NgForm) {
    console.log("form_job",form.value);
      this.jobService.putuserJob(form.value)
        .subscribe(res => {
          M.toast({html: "Job Update Success"});
         window.location.reload();
        });
  }
}
