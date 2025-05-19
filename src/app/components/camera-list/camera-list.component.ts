import { Component, OnInit } from '@angular/core';
import { Camera } from '../../models/camera';

@Component({
  selector: 'app-camera-list',
  standalone:false,
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css']
})
export class CameraListComponent implements OnInit {
  cameras: Camera[] = [];
  filteredCameras: Camera[] = [];
  searchTerm = '';
  selectedStatus = 'all';
  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit(): void {
    this.cameras = this.getDemoCameras();
    this.filterCameras();
  }

  getDemoCameras(): Camera[] {
    return [
      { id: 1, name: 'Caméra Entrée Principale', location: 'Entrée Nord', status: 'online', userId: 1, userName: 'Admin' },
      { id: 2, name: 'Caméra Parking', location: 'Parking', status: 'offline', userId: 2, userName: 'Tech' },
      // ...
    ];
  }

  filterCameras() {
    this.filteredCameras = this.cameras.filter(c => {
      const matchesStatus = this.selectedStatus === 'all' || c.status === this.selectedStatus;
      const matchesSearch = c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            c.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            c.userName.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    this.currentPage = 1;
  }

  get paginatedCameras(): Camera[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCameras.slice(start, start + this.itemsPerPage);
  }

  changePage(delta: number) {
    const maxPage = Math.ceil(this.filteredCameras.length / this.itemsPerPage);
    this.currentPage = Math.max(1, Math.min(this.currentPage + delta, maxPage));
  }
}
