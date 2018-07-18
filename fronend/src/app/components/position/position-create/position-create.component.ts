import { Position } from './../../../models/position';
import { EmployeeService } from './../../../services/employee.service';
import { PositionService } from './../../../services/position.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Employee } from '../../../models/employee';
import { MapsAPILoader } from '../../../../../node_modules/@agm/core';


declare var M: any;

@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.css'],
  providers: [PositionService]
})
export class PositionCreateComponent implements OnInit {
  locationChosen = false;
  public searchControl: FormControl;
  public data : Object;
  public id: string;
  public a : number;
  public zoom: number;
  @ViewChild("search") public searchElementRef: ElementRef;
  constructor(private dialogRef: MatDialogRef<PositionCreateComponent>,
              public positionService: PositionService,
              public employeeService: EmployeeService,
              public _formbuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public new_data: any,
              private mapsAPILoader: MapsAPILoader,
              private ngzone: NgZone
              ) { 
              }

  goback(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
   this.data = this.new_data;
   this.id = this.new_data.pageID;
   this.positionService.pageID = this.id;
  //set google maps defaults
  this.zoom = 4;

   //create search FormControl
   this.searchControl = new FormControl();
   //set current position
   this.setCurrentPosition();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(()=> {
       let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement,{
         types: ['address']
       });
       autocomplete.addListener("place_changed", ()=> {
         this.ngzone.run(() => {
           //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify res
           if (place.geometry === undefined || place.geometry === null) {
             return;
           }
            //set latitude, longitude and zoom
            this.positionService.selectedPosition.lattitude = place.geometry.location.lat();
            this.positionService.selectedPosition.longtitude = place.geometry.location.lng();
            this.zoom = 12;
         });
       });
     });
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.positionService.selectedPosition.lattitude = position.coords.latitude;
        this.positionService.selectedPosition.longtitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  addPosition(form: NgForm) {
    if (this.new_data._id) {
      this.positionService.putPosition(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({html: 'Update Success'});
          this.getPositions();
          this.dialogRef.close();
        });
    } else {
      this.positionService.postPosition(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save Success'});
        this.getPositions();
        this.dialogRef.close();
      });
    }
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.positionService.selectedPosition = new Position();
    }
  }
  onChosenLocation(event) {
    this.positionService.selectedPosition.lattitude = event.coords.lat;
    this.positionService.selectedPosition.longtitude = event.coords.lng;
    this.locationChosen = true;
  }
  getPositions() {
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
        console.log("postion : ",res);
      });
  }
  }

