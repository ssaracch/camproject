import { Component } from '@angular/core';

interface CameraAlert {
  cameraName: string;
  alertDate: string;   // ISO date string
  alertType: string;
  severity: 'High' | 'Medium' | 'Low';
  location: string;
  status: 'Active' | 'Resolved' | 'Pending';
}

@Component({
  selector: 'app-alerts',
  standalone: false,
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent {
  alerts: CameraAlert[] = [
    {
      cameraName: 'Front Gate Cam',
      alertDate: '2025-05-10T08:30:00Z',
      alertType: 'Motion Detected',
      severity: 'High',
      location: 'Main Entrance',
      status: 'Active'
    },
    {
      cameraName: 'Parking Lot Cam',
      alertDate: '2025-05-09T21:15:00Z',
      alertType: 'Camera Offline',
      severity: 'Medium',
      location: 'Parking Area',
      status: 'Resolved'
    },
    {
      cameraName: 'Lobby Cam',
      alertDate: '2025-05-08T14:45:00Z',
      alertType: 'Low Light Alert',
      severity: 'Low',
      location: 'Reception',
      status: 'Pending'
    },
    // add more alerts here
  ];

  searchTerm = '';
  page = 1;
  pageSize = 4;
  sortColumn: keyof CameraAlert | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  pagedItems(): CameraAlert[] {
    let filtered = this.alerts;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.cameraName.toLowerCase().includes(term) ||
        a.alertType.toLowerCase().includes(term) ||
        a.location.toLowerCase().includes(term) ||
        a.status.toLowerCase().includes(term)
      );
    }

    if (this.sortColumn) {
      const key = this.sortColumn as keyof CameraAlert;
      filtered = filtered.sort((a, b) => {
        let res = 0;
        if (a[key] < b[key]) res = -1;
        else if (a[key] > b[key]) res = 1;
        return this.sortDirection === 'asc' ? res : -res;
      });
    }

    const start = (this.page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    const filteredCount = this.alerts.filter(a =>
      a.cameraName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.alertType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    ).length;
    return Math.ceil(filteredCount / this.pageSize) || 1;
  }

  nextPage() {
    if (this.page < this.totalPages()) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  sort(col: keyof CameraAlert) {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
  }

 viewDetails(item: CameraAlert) {
  alert(`Viewing details for ${item.cameraName} alert`);
}

acknowledge(item: CameraAlert) {
  alert(`Acknowledged alert from ${item.cameraName}`);
}

}
