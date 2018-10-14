export class Employee {
  constructor(_id = '', name = '', phone = '') {
    this._id = _id;
    this.name = name;
    this.phone = phone;
  }
  _id: string;
  name: string;
  phone: string
}
