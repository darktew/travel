import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { MatTableDataSource, MatPaginator, MatDialog, TooltipPosition } from '../../../../node_modules/@angular/material';
import { JobCreateComponent } from './job-create/job-create.component';
import { Router } from '@angular/router';
import { IoService } from 'src/app/services/io.service';
import { NotificationService } from 'src/app/services/notification.service';

  
declare var M: any;
@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
  providers: [JobService]
})
export class JobComponent implements OnInit {
  seletedJobs: Job;
  tooltip: TooltipPosition[] = ['left'];
  Jobs: Job[];
  dataSource;
  displayedColumns: string[] = ['jobname', 'total', 'time', 'status' ,'action'];
  isPopupOpened = true;
  check_box;
  pdffile;
  @ViewChild('pdf') pdfFile: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private jobservice: JobService,
              public router: Router,
              private socket: IoService,
              private dialog?: MatDialog,
              private _notification?:NotificationService
              ) { 
            this._notification.requestPermission();
              }

  ngOnInit() {
    this.getJobs();
    this.socket.socket.on('createjob', ()=> {
      this.getJobs();
    });
    
  }
  // downloadPDF() {
  //   let doc = new jspdf();

  //   let spacialElementRef = {
  //     '#editor': function(element, renderer) {
  //         return true
  //     }
  //   }
  //  let content = this.pdfFile.nativeElement;
  //  doc.addFont('fonts/calibri.ttf', 'Calibri', 'normal');
  //  doc.setFont('Calibri');
  //  doc.fromHTML(content.innerHTML, 15, 15, {
  //    'width': 190,
  //    'elementHandlers': spacialElementRef,
  //  });
  //  console.log(content.innerHTML);
  //   doc.save('TRAVEL.pdf');
  // }

  statuschage(element) {
    element.status = "จัดส่งเรียบร้อย";
    this.jobservice.putjob(element)
      .subscribe(res => {
        M.toast({html: 'จัดส่งเรียบร้อย'});
        this.getJobs();
      });
   
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
      width: '1300px',
      height: '750px',
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
      width: '1300px',
      height: '750px',
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
