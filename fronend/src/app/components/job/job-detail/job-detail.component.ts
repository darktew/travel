import { Component, OnInit } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';


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
  public origin: any;
  public destination: any;
  public waypoints: any;
  constructor(
    private jobService: JobService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getJobdetail(id);
    this.zoom = 7;
    this.getDirection();
  }
  getJobdetail(id) {
    this.job = [];
    this.waypoints = [];
    this.jobService.getJob(id)
      .subscribe(res => {
        var test: any = res as Job[];
        this.job.push(test);
        console.log("job", this.job);
        for (let j = 0; j < this.job.length; j++) {
          this.dropzone = this.job[j].dropzone;
          this.dis = this.job[j].dis;
          for (let k = 0; k < this.dis.length; k++) {
            this.origin = { lat: this.dis[this.dis.length - this.dis.length].lattitude, lng: this.dis[this.dis.length - this.dis.length].longtitude };
            this.destination = { lat: this.dis[this.dis.length - 1].lattitude, lng: this.dis[this.dis.length - 1].longtitude };
            console.log("lattitude", this.dis[k].lattitude, "longtitude", this.dis[k].longtitude);
            console.log("origin",this.origin,"des",this.destination);
            for (let b = 1 ; b < this.dis.length -1 ; b++) {
              console.log("length -1 ",this.dis.length -1 );
              this.waypoints.push({
                location: { lat: this.dis[b].lattitude, lng: this.dis[b].longtitude },
                stopover: true
              });
         
            }
            
          }
        }
      });
  }
  getDirection() {
    for (let j = 0; j < this.job.length; j++) {
      
    }
  }

}
