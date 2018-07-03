import { Position } from './../models/position';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  selectedPosition: Position;
  positions: Position[];
  readonly URL_API = 'http://localhost:3000/api/position';
  constructor(private http: HttpClient) {
      this.selectedPosition = new Position();
   }
  getPositions() {
    return this.http.get(this.URL_API);
  }

  // tslint:disable-next-line:no-shadowed-variable
  postPosition(Position: Position) {
    return this.http.post(this.URL_API, Position);
  }

  putPosition(position: Position) {
    return this.http.put(this.URL_API + `/${position._id}`, position);
  }
  deletePosition(_id: string) {
    return this.http.delete(this.URL_API + `/${_id}`);
  }
}
