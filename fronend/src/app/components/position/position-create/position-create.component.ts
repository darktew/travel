import { Position } from './../../../models/position';
import { EmployeeService } from './../../../services/employee.service';
import { PositionService } from './../../../services/position.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Employee } from '../../../models/employee';
import { MapsAPILoader } from '../../../../../node_modules/@agm/core';
import { } from 'googlemaps';
import { ValidateService } from 'src/app/services/validate.service';
declare var M: any;
declare var google: any;
@Component({
  selector: 'app-position-create',
  templateUrl: './position-create.component.html',
  styleUrls: ['./position-create.component.css'],
  providers: [PositionService]
})
export class PositionCreateComponent implements OnInit {
  locationChosen = false;
  public searchControl: FormControl;
  public data: Object;
  public id: string;
  public a: number;
  public zoom: number;
  protected map: any;
  title: String;
  @ViewChild("search") public searchElementRef: ElementRef;
  constructor(private dialogRef: MatDialogRef<PositionCreateComponent>,
    public positionService: PositionService,
    public employeeService: EmployeeService,
    public _formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public new_data: any,
    private mapsAPILoader: MapsAPILoader,
    private ngzone: NgZone,
    public validate: ValidateService
  ) {
  }

  goback(): void {
    this.dialogRef.close();
  }
  protected mapReady(map) {
    this.map = map;
  }

  ngOnInit() {
    this.data = this.new_data;
    this.id = this.new_data.pageID;
    if (!this.id) {
      this.title = "แก้ไขข้อมูลลูกค้า";
    } else {
      this.title = "เพิ่มข้อมูลลูกค้า";
    }
    this.positionService.pageID = this.id
    this.positionService.selectedPosition = this.new_data;
    //set google maps defaults
    this.zoom = 4;

    //create search FormControl
    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      let geocoder = new google.maps.Geocoder;
      autocomplete.addListener("place_changed", () => {
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
          this.positionService.selectedPosition.address = place.formatted_address;
          this.map.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
          this.zoom = 15;
        });
      });
      // this.positionService.selectedPosition.address = results[0].formatted_address;
    });
  }
  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.positionService.selectedPosition.lattitude = position.coords.latitude;
        this.positionService.selectedPosition.longtitude = position.coords.longitude;
      });
    }
  }
  addPosition(form: NgForm) {
    const address = {
      address: form.value.address
    };
    if (!this.validate.validateAddress(address)) {
      M.toast({ html: 'Plase Search Address', classes: 'rounded', displayLength: 4000 });
      return false;
    }
    if (this.new_data._id) {
      this.positionService.putPosition(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({ html: 'Update Success' });
          this.getPositions();
          this.dialogRef.close();
        });
    } else {
      this.positionService.postPosition(form.value)
        .subscribe(res => {
          this.resetForm(form);
          M.toast({ html: 'Save Success' });
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
    this.searchAddressbylatlng(event.coords.lat,event.coords.lng,this.positionService);
  }
  getPositions() {
    this.positionService.getPositions()
      .subscribe(res => {
        this.positionService.positions = res as Position[];
        console.log("postion : ", res);
      });
  }
  searchAddressbylatlng(lat, lng, position) {
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder;
      let latlng = { lat: lat, lng: lng }
      geocoder.geocode({ 'location': latlng }, function (results, status) {
          if (results[0]) {
            position.selectedPosition.address = results[0].formatted_address;
        }  
      });
    });
  }
}

