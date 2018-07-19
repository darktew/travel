export class Job {
    constructor (_id = '', jobname = '', address = [], id = [], dis = []) {
        this._id = _id;
        this.jobname = jobname;
        this.address = address;
        this.id = id;
        this.dis = dis;
        this.date = new Date;
        this.delivery = 0;
    }
    _id: string;
    jobname: string;
    address: Array<Object>;
    id: Array<String>;
    lattitude: Array<Object>;
    longtitude: Array<Object>;
    dis: Array<Object>;
    date: Date;
    delivery: Number;
}
