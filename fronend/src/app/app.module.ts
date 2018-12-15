import { EmployeeFilterPipe } from './components/employees/employee-filter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule, MatIconModule, MatProgressBarBase, MatBadgeModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
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
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { HttpModule } from '@angular/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard }  from '../app/guards/auth.guards';
import { UploadsComponent } from './components/uploads/uploads.component';
import { SafePipePipe } from './pipe/safe-pipe.pipe';
import { JobfilterPipe } from './pipe/jobfilter.pipe';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { ExportAsModule } from 'ngx-export-as';

export function tokenGetter() {
  return localStorage.getItem('id_token');
}
const routes: Routes = [
  {path: '', redirectTo:  '/login', pathMatch: 'full'},
  {path: '', component: NavbarComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, data: {depth: 2}},
  {path: 'login', component: LoginComponent, data: {depth: 1}},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: {depth: 6}},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard], data:{ depth: 3}},
  {path: 'customer', component: EmployeesComponent, data:{ depth: 4}},
  {path: 'customer/:id', component: EmployeeDetailComponent, data: {depth: 8}},
  {path: 'job', component: JobComponent, data:{ depth: 5}},
  {path: 'job/detail/:id', component: JobDetailComponent, data: {depth: 7}},
  {path: '**', component: PageNotFoundComponent},
  {path: '#', component: HomeComponent,canActivate: [AuthGuard]}
];

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
    JobDetailComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    UploadsComponent,
    SafePipePipe,
    JobfilterPipe,
  ],
  imports: [
    BrowserModule,
    ExportAsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    MatToolbarModule,
    MatTooltipModule,
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
    MatBadgeModule,
    NgxPaginationModule,
    DraggaleModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3001/api/users']
      }
    }),
    CountdownTimerModule.forRoot(),
    FlashMessagesModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB82hkYAY3SZRDmpH_SCcd3W8NgAnl9TPw',
      libraries: ['places']
    }),
    AgmDirectionModule,
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
  providers: [AuthGuard],
  entryComponents: [
    EmployeeCreateComponent,
    PositionCreateComponent,
    JobCreateComponent,
    UploadsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
