import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { MatTableDataSource, MatPaginator, MatDialog, TooltipPosition } from '../../../../node_modules/@angular/material';
import { JobCreateComponent } from './job-create/job-create.component';
import { Router } from '@angular/router';
import { IoService } from 'src/app/services/io.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}
// import * as jsPDF from 'jspdf';
// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
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
              private _notification?:NotificationService,
             ) { 
            this._notification.requestPermission();
              }

  ngOnInit() {
    this.getJobs();
    this.socket.socket.on('createjob', ()=> {
      this.getJobs();
    });
    
  }
  
  downloadPDF() {
  var docDefinition = {
    content: [
      { text: 'ข้อมูลการจัดส่ง', style: 'header' },
      {text: 'รอบการจัดส่งทั้งหมด',style: 'subheader'},
      this.table(this.Jobs, ['jobname', 'total','time', 'status'])
    ],
    defaultStyle: {
      font: 'THSarabunNew'
    },
    styles: {
      header: {
        fontSize: 36,
        alignment: 'center' 
      },
      subheader: {
        fontSize: 18
      },
      table: {
        fontSize: 16
      }
    }
  };
  pdfMake.createPdf(docDefinition).open()
  }

  statuschage(element) {
    element.status = "จัดส่งเรียบร้อย";
    this.jobservice.putjob(element)
      .subscribe(res => {
        M.toast({html: 'จัดส่งเรียบร้อย'});
        this.getJobs();
      });
   
  }
  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);
    data.forEach(function(row) {
        var dataRow = [];
        columns.forEach(function(column) {
            dataRow.push(row[column].toString());
        })
        body.push(dataRow);
    });
    body[0][0] = "ชื่อรอบงาน";
    body[0][1] = "ระยะทางทั้งหมด";
    body[0][2] = "ระยะเวลาทั้งหมด";
    body[0][3] = "สถานะการจัดส่ง";
    return body;
}
   table(data, columns) {
    return {
        table: {
            headerRows: 1,
            widths: [ '*', 'auto', '*', '*' ],
            style: 'table',
            body: this.buildTableBody(data, columns)
        }
    };
  }  
  getJobs() {
    var job;
    this.jobservice.getJobs()
      .subscribe(res => {
        this.Jobs = res as Job[];
        job = this.Jobs;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        console.log(this.Jobs);
      });
    return job;
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
