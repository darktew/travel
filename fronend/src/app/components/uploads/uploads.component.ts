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
  name_img;
  url_img:any;
  disable;
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
      var reader = new FileReader();
      this.disable = true;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload =  (e) => {
        this.url_img = e.target['result'];
      }
  }
  onUploads() {
    const fd = new FormData();
    fd.append('image',this.selectFile,this.selectFile.name);
    console.log("fd",fd);
    this.http.put('http://localhost:3000/api/users/upload/'+`${this.data._id}`, fd, {
       reportProgress: true,
       observe: 'events'
    })
    .subscribe(event=> {
       if (event.type == HttpEventType.UploadProgress) {
         console.log('Upload Progress', Math.round(event.loaded / event.total * 100));
       } else if(event.type == HttpEventType.Response) {
        M.toast({html: 'เปลี่ยนรูปภาพเสร็จสิ้น'});
         this.dialogRef.close();
       }
    });
  }
}
