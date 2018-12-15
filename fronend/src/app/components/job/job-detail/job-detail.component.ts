import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Job } from '../../../models/job';
import { JobService } from '../../../services/job.service';
import { MatTableDataSource, MatDialog, TooltipPosition } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SortEvent } from '../../../draggale/sortable-list.directive';
import { NgForm } from '@angular/forms';
import { JobCreateComponent } from '../job-create/job-create.component';
import { IoService } from 'src/app/services/io.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as htmlToImage from 'html-to-image';
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
declare var M: any;
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class JobDetailComponent implements OnInit {
  position: TooltipPosition[] = ['right','before'];
  job: Job[];
  dis: any;
  dropzone: any;
  zoom: any;
  selectJob: Job;
  sorts: boolean;
  id_param: any;
  isPopupOpened = false;
  time: String;
  total: any;
  first_word: String;
  distance: Array<String> = [];
  duration: Array<String> = [];
  text_distance: Array<String> = [];
  text_duration: Array<String> = [];
  origin: any;
  public destination: any;
  public waypoints: any;
  word: any = [];
  check_staus;
  status_chage1;
  status_chage2;
  status_chage3;
  status_chage4;
  name;
  date;
  x;
  timer;
  @ViewChild('map') testmap: ElementRef;
  constructor(
    private jobService: JobService,
    public route: ActivatedRoute,
    public location: Location,
    private dialog?: MatDialog,
    private socket?: IoService,
    private _notification? : NotificationService
  ) {  
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.getJobdetail(id);
    this.zoom = 7;
    this.selectJob = new Job();
    this.id_param = id;
    this.sorts = true;
    this.notify();
   
  }
  AddJob() {
    this.isPopupOpened = true;
    this.sorts = true;
    const dialogRef = this.dialog.open(JobCreateComponent, {
      width: '1300px',
      height: '750px',
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
  }
 
  downloadPdf() {
    htmlToImage.toJpeg(document.getElementById('map')).then((dataURL) => {
      var docDefinition = {
        header: {text:'รายละเอียด',style: 'head'},
        pageSize: 'A4',
        content: [
          { text: 'ชื่อรอบงาน: '+ this.job[0].jobname, style: 'header'},
          {text: 'ระยะทางทั้งหมด: ' + this.job[0].total.toFixed(2) + ' กม.' ,style: 'headercontent'},
          {text: 'ระยะเวลาทั้งหมด: ' + this.job[0].time, style: 'headercontent'},
          {text: 'รายละเอียดการขนส่ง', style:'content'},
          {
            ol: this.list(this.job[0].dis,this.job[0].dropzone), style: 'list'
          },
          {image:  dataURL,width: 500,height:250},
          {text: 'รูปภาพเส้นทาง', style: 'map'}
        ],
        defaultStyle: {
          font: 'THSarabunNew'
        },
        styles: {
          head: {
            fontSize: 24,
            alignment: 'center',
            margin: 50 
          },
          header: {
            fontSize: 18
          },
          headercontent: {
            fontSize: 16
          },
          map: {
            fontSize: 16,
            alignment: 'center'
          },
          content: {
            fontSize: 16
          },
          list: {
            fontSize: 16
          }
        },
        pageMargins: [ 40, 60, 40, 80 ]
      };
      pdfMake.createPdf(docDefinition).open();
    });
  }
  list(address,dropzone) {
    var data = [];
    data.push("จุดเริ่มต้น: " + address[0].address); 
       for(let i=0; i < dropzone.length;i++){
           data.push(
             "ผู้รับสินค้า: " + dropzone[i].employee.name + 
             "\n ที่อยู่ผู้รับ: " + address[i+1].address + 
             "\n ระยะทาง: " + address[i+1].distance.text + 
             "\n ใช้เวลา: " + address[i+1].duration.text);
       }
      return data;
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
          this.total = this.job[j].total.toFixed(2);
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
        switch(this.job[0].status) {
          case 'เตรียมการจัดส่ง':  
          this.status_chage1 = true; 
          this.status_chage2 = false;
          this.status_chage3 = false;
          this.status_chage4 = false;
          break;
          case 'แพ็คสินค้าเตรียมนำส่ง' :
          this.status_chage1 = true; 
          this.status_chage2 = true; 
          this.status_chage3 = false;
          this.status_chage4 = false;
          break;
          case 'กำลังจัดส่ง' : 
          this.status_chage1 = true; 
          this.status_chage2 = true;
          this.status_chage3 = true;
          this.status_chage4 = false; 
          break;
          case 'จัดส่งเสร็จสิ้น' :
          this.status_chage1 = true; 
          this.status_chage2 = true;
          this.status_chage3 = true;  
          this.status_chage4 = true; 
          break;
          default : throw new Error('Invalid status');
        }
        if (this.job[0].status == 'กำลังจัดส่ง') {
           this.timer = true;
        }
        this.first_word = char[0].toUpperCase();
        this.check_staus = this.job[0].status;
        this.selectJob._id = this.id_param;
        this.selectJob.jobname = this.job[0].jobname;
        this.name = this.job[0].jobname;
        this.date = new Date(this.job[0].date);
        
         this.date.setHours(this.date.getHours() + this.job[0].obj_time['hour']);
         this.date.setMinutes(this.date.getMinutes() + this.job[0].obj_time['min']);
      });
      
  }
  
  notify() {
  this.socket.socket.on('ChangeStatus', (message)=> {
    console.log("Connect IO");
        if (message.message) {
          let data = {
            'title': this.name,
            'alertContent': 'ครบเวลาที่กำหนดไว้แล้ว'
          };
          this._notification.generateNotification(data);
        } 
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
  chageStatusUp() {
    if (confirm('ต้องการเปลี่ยนสถานะการจัดส่ง')) {
       switch(this.job[0].status) {
         case 'เตรียมการจัดส่ง' : 
         this.job[0].status = 'แพ็คสินค้าเตรียมนำส่ง';
         
         this.jobService.putstatusJob(this.job[0])
          .subscribe(res => {
            this.status_chage1 = true;
            this.status_chage2 = true;
          })
         break;
         case 'แพ็คสินค้าเตรียมนำส่ง' :    
         this.job[0].status = 'กำลังจัดส่ง';
         this.jobService.putstatusJob(this.job[0])
          .subscribe(res => {
            this.getJobdetail(this.id_param);
            this.status_chage1 = true;
            this.status_chage2 = true;
            this.status_chage3 = true;
          }) 
         break;
       }  
    }
  }
  chageStatusDown() {
    if (confirm('ต้องการเปลี่ยนสถานะการจัดส่ง')) { 
      switch(this.job[0].status) {
        case 'แพ็คสินค้าเตรียมนำส่ง' : 
        this.job[0].status =  'เตรียมการจัดส่ง';
        this.jobService.putstatusJob(this.job[0])
         .subscribe(res => {
           this.getJobdetail(this.id_param);
           this.status_chage1 = true;
           this.status_chage2 = false;
           this.status_chage3 = false;
           this.status_chage4 = false;
         })
        break;
        case 'กำลังจัดส่ง': 
         this.job[0].status =  'แพ็คสินค้าเตรียมนำส่ง';
         this.jobService.putstatusJob(this.job[0])
          .subscribe(res => {
            this.getJobdetail(this.id_param);
            this.status_chage1 = true;
            this.status_chage2 = true;
            this.status_chage3 = false;
            this.status_chage4 = false;
          })
          
         break;
      }
    }
  }
}
