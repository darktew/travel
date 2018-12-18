import { Observable } from 'rxjs';
import { Position } from './../models/position';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PositionService {
  selectedPosition: Position;
  pageID: String;
  positions: Position[];
  readonly URL_API = 'https://localhost:3000/api/position';
  constructor(private http: HttpClient) {
      this.selectedPosition = new Position();
   }
  getPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(this.URL_API);
  }

  // tslint:disable-next-line:no-shadowed-variable
  postPosition(position: Position) {
    return this.http.post(this.URL_API, position);
  }
  getPositionByEmployeeId(employee_id: String) {
    return this.http.get(this.URL_API + `/employee` + `/${employee_id}`);
  }
  putPosition(position: Position) {
    return this.http.put(this.URL_API + `/${position._id}`, position);
  }
  deletePosition(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
  deleteAllPosition(id) {
    return this.http.delete(this.URL_API + `/employee` + `/${id}`);
  }
}
