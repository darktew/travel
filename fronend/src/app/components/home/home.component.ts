import { Component, OnInit } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { Job } from 'src/app/models/job';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  home: Job[];
  page: String;
  check_page: boolean = false;
  time: String;
  distance: any;
  img: boolean;
  position: any;
  origin: Object;
  destination: Object;
  waypoints: any = [];
  dis: any;
  name_job: any;
  date_check = new Date();
  page_set = true;
  constructor(public jobService: JobService) { }

  ngOnInit() {
    this.getJobsInHome();
  }
  getJobsInHome() {
    this.jobService.getJobsInHome()
      .subscribe(res => {
        this.home = res as Job[];
        console.log(this.home);
        let status = "กำลังจัดส่ง";
        let arr_i = [];
        if (this.home.length == 0) {
          this.page_set = this.page_set;
          this.page = "ไม่มีการจัดส่งสินค้า";
          this.check_page = this.check_page;
          this.img = false;
        } else {
          for (let i = 0; i < this.home.length; i++) {
            if (this.home[i].status == status) {
              arr_i.push(i);
            }
          }
          if (arr_i.length == 0) {
            this.page_set = this.page_set;
            this.page = "จัดส่งสินค้าเรียบร้อย";
            this.check_page = this.check_page;
            this.img = false;
          } else {
            let max = Math.max.apply(null, arr_i);
            this.time = this.home[max].time;
            this.distance = this.home[max].total.toFixed(2);
            this.position = this.home[max].dis.length - 1 + " จุด";
            this.img = true;
            this.dis = this.home[max].dis;
            this.name_job = this.home[max].jobname;
            this.check_page = true;
            this.page_set = false;
            this.origin = {
              lat: this.dis[0].lattitude,
              lng: this.dis[0].longtitude
            };
            this.destination = {
              lat: this.dis[this.dis.length - 1].lattitude,
              lng: this.dis[this.dis.length - 1].longtitude
            };
            for (let w = 1; w < this.dis.length - 1; w++) {
              this.waypoints.push({
                location: { lat: this.dis[w].lattitude, lng: this.dis[w].longtitude },
                stopover: true
              });
            }
          }
        }
      });
  }
}
