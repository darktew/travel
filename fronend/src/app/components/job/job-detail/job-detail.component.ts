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
  constructor(
    private jobService: JobService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getJobdetail(id);
    this.zoom = 7;
  
  }
  getJobdetail(id) {
    this.job = [];
    this.jobService.getJob(id)
      .subscribe(res => {
        var test: any = res as Job[];
        this.job.push(test);
        console.log("job",this.job);
        for (let j = 0; j < this.job.length; j++) {
            this.dropzone = this.job[j].dropzone;
            this.dis = this.job[j].dis;
            console.log(this.dis);
        }
      });
    }
 
}
