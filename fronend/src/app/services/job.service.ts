import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  readonly URL_API = 'http://localhost:3000/api/jobs';
  constructor(private http: HttpClient) { }
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.URL_API);
  }

  // tslint:disable-next-line:no-shadowed-variable
  postJob(job: Job) {
    return this.http.post(this.URL_API, job);
  }
  // getPositionByEmployeeId(employee_id: String) {
  //   return this.http.get(this.URL_API+`/employee`+`/${employee_id}`);
  // }
  putjob(job: Job) {
    return this.http.put(this.URL_API + `/${job._id}`, job);
  }
  deleteJob(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}

