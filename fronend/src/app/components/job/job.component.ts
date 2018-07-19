import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { MatTableDataSource, MatPaginator, MatDialog } from '../../../../node_modules/@angular/material';
import { JobCreateComponent } from './job-create/job-create.component';

declare var M: any;
@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
  providers: [JobService]
})
export class JobComponent implements OnInit {
  seletedJobs: Job;
  Jobs: Job[];
  dataSource;
  displayedColumns: string[] = ['jobname', 'action'];
  isPopupOpened = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private jobservice: JobService,
              private dialog?: MatDialog) { }

  ngOnInit() {
    this.getJobs();
  }
  getJobs() {
    this.jobservice.getJobs()
      .subscribe(res => {
        this.Jobs = res as Job[];
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        console.log(this.Jobs);
      });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteJob(_id: string) {
    if (confirm('Are you sure you want to delete it?')) {
      this.jobservice.deleteJob(_id)
        .subscribe(res => {
          this.getJobs();
          M.toast({ html: 'Deleted Success' });
        });
    }
  }
  AddJob() {
    this.isPopupOpened = true;
    const dialogRef = this.dialog.open(JobCreateComponent, {
      width: '1000px',
      height: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getJobs();
    });
  }
  editJob(job: Job) {
    this.isPopupOpened = true;
    this.seletedJobs = job;
    const dialogRef = this.dialog.open(JobCreateComponent, {
      data: this.seletedJobs
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getJobs();
    });
  }
}
