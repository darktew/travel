import { Component, OnInit } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: Job[];
 
  constructor(
    private jobService: JobService,
  ) { }

  ngOnInit() {
    
  }

}
