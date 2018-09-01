import { Component, OnInit, ViewChild } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { MatTableDataSource, MatPaginator, MatDialog } from '../../../../node_modules/@angular/material';
import { JobCreateComponent } from './job-create/job-create.component';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['jobname', 'total', 'time', 'action'];
  isPopupOpened = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private jobservice: JobService,
              public router: Router,
              private dialog?: MatDialog,
              ) { }

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
    // this.dataSource.filter = filterValue.trim().toLowerCase();

    // this.dataSource.filterPredicate = (data, filter) => {
    //   const dataStr = data.name + data.employee.name;
    //   return dataStr.indexOf(filter) != -1;
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
    console.log(job);
    this.isPopupOpened = true;
    this.seletedJobs = job;
    const dialogRef = this.dialog.open(JobCreateComponent, {
      width: '1000px',
      height: '500px',
      data: this.seletedJobs
    });
    dialogRef.afterClosed().subscribe(result => {
      this.isPopupOpened = false;
      this.getJobs();
    });
  }
  onSelect(element) {
  
    this.router.navigate(['/job/detail', element._id]);
  }
}
