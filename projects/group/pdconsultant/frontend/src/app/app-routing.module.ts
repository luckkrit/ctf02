import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardGuard } from './shared/dashboard.guard';
import { RegisterComponent } from './authentication/register/register.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PatientGuard } from './shared/patient.guard';
import { DoctorGuard } from './shared/doctor.guard';
import { PatientComponent } from './pdconsultant/patient/patient.component';
import { DoctorComponent } from './pdconsultant/doctor/doctor.component';
import { NurseComponent } from './pdconsultant/nurse/nurse.component';
import { NurseGuard } from './shared/nurse.guard';
import { AdminComponent } from './pdconsultant/admin/admin.component';
import { AdminGuard } from './shared/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [DashboardGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard/patient',
    component: PatientComponent,
    canActivate: [PatientGuard],
  },
  {
    path: 'dashboard/doctor',
    component: DoctorComponent,
    canActivate: [DoctorGuard],
  },
  {
    path: 'dashboard/nurse',
    component: NurseComponent,
    canActivate: [NurseGuard],
  },
  {
    path: 'dashboard/admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
