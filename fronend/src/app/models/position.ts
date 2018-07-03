import { Employee} from '../models/employee';
export class Position {
  constructor(_id= '', address= '', lattitude =  15.49090076080715, longtitude = 100.84046497901011, employee = {} ) {
    this._id = _id;
    this.address = address;
    this.lattitude = lattitude;
    this.longtitude = longtitude;
    this.employee = employee;
  }
  _id: string;
  address: string;
  lattitude: number;
  longtitude: number;
  employee: Object;
}

