import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { CameraListComponent } from './components/camera-list/camera-list.component';
import { CameraDetailComponent } from './components/camera-detail/camera-detail.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { CameraManagementComponent } from './components/camera-management/camera-management.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CameraComponent } from './components/camera/camera.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CameraListComponent,
    CameraDetailComponent,
    AlertsComponent,
    CameraManagementComponent,
    LayoutComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgApexchartsModule,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
