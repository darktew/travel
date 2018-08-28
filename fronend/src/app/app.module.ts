import { EmployeeFilterPipe } from './components/employees/employee-filter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule, MatIconModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { PositionComponent } from './components/position/position.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeCreateComponent } from './components/employees/employee-create/employee-create.component';
import { PositionCreateComponent } from './components/position/position-create/position-create.component';
import { EmployeeDetailComponent } from './components/employees/employee-detail/employee-detail.component';
import { JobComponent } from './components/job/job.component';
import { JobCreateComponent } from './components/job/job-create/job-create.component';
import { DraggaleModule } from './draggale/draggale.module';
import { JobDetailComponent } from './components/job/job-detail/job-detail.component';


const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: 'customer', component: EmployeesComponent},
  {path: 'customer/:id', component: EmployeeDetailComponent},
  // {path: 'customer/create', component: EmployeeCreateComponent},
  // {path: 'position', component: PositionComponent},
  {path: 'job', component: JobComponent},
  {path: 'job/user/:id', component: JobDetailComponent},
  {path: '**', component: PageNotFoundComponent}];

@NgModule({
  declarations: [
    AppComponent,
    EmployeesComponent,
    PositionComponent,
    PageNotFoundComponent,
    EmployeeCreateComponent,
    EmployeeFilterPipe,
    PositionCreateComponent,
    EmployeeDetailComponent,
    JobComponent,
    JobCreateComponent,
    JobDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    NgxPaginationModule,
    DraggaleModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw',
      libraries: ['places']
    }),
    RouterModule.forRoot(routes)

  ],
  exports: [
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  providers: [],
  entryComponents: [
    EmployeeCreateComponent,
    PositionCreateComponent,
    JobCreateComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
