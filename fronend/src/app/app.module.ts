import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PositionComponent } from './components/position/position.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'customer', component: EmployeesComponent},
  {path: 'position', component: PositionComponent}];

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PositionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw'
    }),
    RouterModule.forRoot(routes)

  ],
  exports: [
    MatButtonModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
