export class Position {
  constructor(_id= '', address= '', lattitude = 15.294584987456021, longtitude = 100.523186, employee = null, id = '') {
    this._id = _id;
    this.address = address;
    this.lattitude = lattitude;
    this.longtitude = longtitude;
    this.employee = employee;
    this.id = id;
  }
  _id: string;
  address: string;
  lattitude: number;
  longtitude: number;
  employee: Object;
  id: string;
}

