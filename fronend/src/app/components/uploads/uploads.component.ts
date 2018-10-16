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
         console.log(event);
         this.dialogRef.close();
       }
    });
  }
}
