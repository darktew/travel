import { Employee } from "./employee";

export class Job {
    constructor ( 
        _id = '', 
        jobname = '', 
        address = [], 
        id = [], 
        dis = [], 
        lattitude = [], 
        longtitude = [], 
        total = 0,
        time = '',
        dropzone = {}) {
        this._id = _id;
        this.jobname = jobname;
        this.address = address;
        this.id = id;
        this.dis = dis;
        this.date = new Date;
        this.delivery = 0;
        this.lattitude = lattitude;
        this.longtitude = longtitude;
        this.total = total;
        this.time = time; 
        this.dropzone = dropzone;
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
    total: Number; 
    time:String;
    dropzone: Object;
}
