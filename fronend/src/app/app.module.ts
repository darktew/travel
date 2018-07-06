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
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PositionComponent } from './components/position/position.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeCreateComponent } from './components/employee-create/employee-create.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'customer', component: EmployeesComponent},
  {path: 'customer/create', component: EmployeeCreateComponent},
  {path: 'position', component: PositionComponent}];

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PositionComponent,
    PageNotFoundComponent,
    EmployeeCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
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
    MatTableModule,
    MatInputModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
