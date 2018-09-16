import { Component, OnInit } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SortEvent } from '../../../draggale/sortable-list.directive';

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
  }
  goback() {
    this.location.back();
 
  }
  getJobdetail(id) {
    this.job = [];
    this.waypoints = [];
    this.jobService.getJob(id)
      .subscribe(res => {
        var test: any = res as Job[];
        this.job.push(test);
        for (let j = 0; j < this.job.length; j++) {
          this.dropzone = this.job[j].dropzone;
          this.dis = this.job[j].dis;
        }
        for (let k = 0; k < this.dis.length; k++) {
          this.origin = { lat: this.dis[0].lattitude, lng: this.dis[0].longtitude };
          this.destination = { lat: this.dis[this.dis.length - 1].lattitude, lng: this.dis[this.dis.length - 1].longtitude };
        }
        for (let b = 1 ; b < this.dis.length -1 ; b++) {
          this.waypoints.push({
            location: { lat: this.dis[b].lattitude, lng: this.dis[b].longtitude },
            stopover: true
          });
        }
      });
  }
  sort(event: SortEvent) {
   const current = this.job[0].dropzone[event.currentIndex];
   const swapWith = this.job[0].dropzone[event.newIndex];
  this.job[0].dropzone[event.currentIndex] = swapWith;
  this.job[0].dropzone[event.newIndex] = current;
  }
}
