import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';
import { JobService } from '../../../services/job.service';
import { Job } from '../../../models/job';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css'],
})
export class JobCreateComponent implements OnInit {
  select: Job;
  constructor(private dialogRef: MatDialogRef<JobCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public jobservice: JobService) { }

  ngOnInit() {
    this.select = this.data;
  }
  goback(): void {
    this.dialogRef.close();
  }
}
