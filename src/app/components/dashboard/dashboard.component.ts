import { Component, OnInit } from '@angular/core';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartType } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalCameras = 100; // Example data, replace with real data
  activeCameras = 90;
  offlineCameras = 10;

  show: boolean = false;

   cameraStatus!: {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    colors: string[];
    responsive: ApexResponsive[];
  };
  
  constructor() {}

  ngOnInit(): void {
    this.cameraStatus = {
      series: [90, 10],
      chart: {
        type: 'donut' as ChartType, // Explicit cast to ChartType
        height: 250
      },
      labels: ['Active Cameras', 'Offline Cameras'],
      colors: ['#28a745', '#dc3545'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  toggle() {
    this.show = !this.show;
  }
}
