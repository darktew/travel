import { Component, OnInit, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient,HttpEventType } from '@angular/common/http';




declare var M:any;
@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.css']
})
export class UploadsComponent implements OnInit {
  selectFile:File = null;
  img:any;
  name_img: any;
  url;
  confirm:boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UploadsComponent>,
    public http: HttpClient
  ) { }

  ngOnInit() {
    
  }
  goback() {
    this.dialogRef.close();
  }
  onFileSelected(event) {
      this.selectFile = <File>event.target.files[0];
      this.name_img = this.selectFile.name;
      this.confirm = true;
        let reader = new FileReader();
        reader.readAsDataURL(<File>event.target.files[0]);
        reader.onload = (event) => {
          this.url = event.target['result'];
      }
  }
  onUploads() {
    if(this.selectFile) {
      const fd = new FormData();
      fd.append('image',this.selectFile,this.selectFile.name);
      this.http.put('http://localhost:3000/api/users/upload/'+`${this.data._id}`, fd, {
         reportProgress: true,
         observe: 'events'
      })
      .subscribe(event=> {
         if (event.type == HttpEventType.UploadProgress) {
         } else if(event.type == HttpEventType.Response) {
          M.toast({ html: 'เปลี่ยนรูปเสร็จสิ้น' });
           this.dialogRef.close();
         }
      });
    } else {
      M.toast({ html: 'กรุณาเลือกรูป' });
      return false;
    }
   
  }
}
