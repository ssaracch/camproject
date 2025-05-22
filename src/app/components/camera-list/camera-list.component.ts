import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface Camera {
  id_Camera: string;
  nom_Camera: string;
  location: string;
  status_Camera: string;
  id_User: string;
  dateCreation?: string;
}

@Component({
  selector: 'app-camera-management',
  standalone: false,
  templateUrl: './camera-list.component.html',
  styleUrl: './camera-list.component.css'
})
export class CameraListComponent implements OnInit {
  
  cameras: Camera[] = [
    {
      id_Camera: 'CAM001',
      nom_Camera: 'Caméra Entrée',
      location: 'Hall Principal',
      status_Camera: 'normal',
      id_User: 'USER001',
      dateCreation: '2024-01-15'
    },
    {
      id_Camera: 'CAM002',
      nom_Camera: 'Caméra Parking',
      location: 'Parking Nord',
      status_Camera: 'offline',
      id_User: 'USER002',
      dateCreation: '2024-01-10'
    },
    {
      id_Camera: 'CAM003',
      nom_Camera: 'Caméra Bureau',
      location: 'Bureau Direction',
      status_Camera: 'blurry',
      id_User: 'USER003',
      dateCreation: '2024-01-20'
    }
  ];

  filteredCameras: Camera[] = [];
  selectedStatus: string = 'all';
  cameraForm!: FormGroup;
  isEditMode: boolean = false;
  currentCamera: Camera | null = null;
  modalRef: NgbModalRef | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.filteredCameras = [...this.cameras];
  }

  private initializeForm(): void {
    this.cameraForm = this.formBuilder.group({
      nom_Camera: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      dateCreation: ['', Validators.required]
    });
  }

  filterCameras(): void {
    if (this.selectedStatus === 'all') {
      this.filteredCameras = [...this.cameras];
    } else {
      this.filteredCameras = this.cameras.filter(
        camera => camera.status_Camera === this.selectedStatus
      );
    }
  }

  openAddModal(content: TemplateRef<any>): void {
    this.isEditMode = false;
    this.currentCamera = null;
    this.resetForm();
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'md'
    });
  }

  openEditModal(content: TemplateRef<any>, camera: Camera): void {
    this.isEditMode = true;
    this.currentCamera = camera;
    this.populateForm(camera);
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'md'
    });
  }

  private resetForm(): void {
    this.cameraForm.reset();
    this.cameraForm.patchValue({
      dateCreation: new Date().toISOString().split('T')[0]
    });
  }

  private populateForm(camera: Camera): void {
    this.cameraForm.patchValue({
      nom_Camera: camera.nom_Camera,
      location: camera.location,
      dateCreation: camera.dateCreation || new Date().toISOString().split('T')[0]
    });
  }

  saveCamera(): void {
    if (this.cameraForm.valid) {
      const formValue = this.cameraForm.value;
      
      if (this.isEditMode && this.currentCamera) {
        // Update existing camera
        const index = this.cameras.findIndex(c => c.id_Camera === this.currentCamera!.id_Camera);
        if (index !== -1) {
          this.cameras[index] = {
            ...this.currentCamera,
            nom_Camera: formValue.nom_Camera,
            location: formValue.location,
            dateCreation: formValue.dateCreation
          };
        }
      } else {
        // Add new camera
        const newCamera: Camera = {
          id_Camera: this.generateCameraId(),
          nom_Camera: formValue.nom_Camera,
          location: formValue.location,
          status_Camera: 'normal',
          id_User: 'USER001', // This should come from current user context
          dateCreation: formValue.dateCreation
        };
        this.cameras.push(newCamera);
      }
      
      this.filterCameras(); // Refresh filtered list
      this.closeModal();
    } else {
      this.markFormGroupTouched();
    }
  }

  editCamera(camera: Camera): void {
    // This method would be called from the template
    // You would need to pass the template reference here
    console.log('Edit camera:', camera);
    // Implementation depends on how you want to handle template reference
  }

  deleteCamera(camera: Camera): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la caméra "${camera.nom_Camera}" ?`)) {
      const index = this.cameras.findIndex(c => c.id_Camera === camera.id_Camera);
      if (index !== -1) {
        this.cameras.splice(index, 1);
        this.filterCameras(); // Refresh filtered list
      }
    }
  }

  private closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  private generateCameraId(): string {
    const maxId = this.cameras.reduce((max, camera) => {
      const numericId = parseInt(camera.id_Camera.replace('CAM', ''), 10);
      return numericId > max ? numericId : max;
    }, 0);
    
    return `CAM${String(maxId + 1).padStart(3, '0')}`;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cameraForm.controls).forEach(key => {
      const control = this.cameraForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onSubmit(): void {
    this.saveCamera();
  }

  // Getters for form validation
  get nom_Camera() {
    return this.cameraForm.get('nom_Camera');
  }

  get location() {
    return this.cameraForm.get('location');
  }

  get dateCreation() {
    return this.cameraForm.get('dateCreation');
  }

  // Method to get validation error messages
  getErrorMessage(fieldName: string): string {
    const field = this.cameraForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName} est requis`;
      }
      if (field.errors['minlength']) {
        return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      }
    }
    return '';
  }

  // Statistics calculations
  get activeCameras(): number {
    return this.cameras.filter(camera => camera.status_Camera === 'normal').length;
  }

  get offlineCameras(): number {
    return this.cameras.filter(camera => camera.status_Camera === 'offline').length;
  }

  get blurryCameras(): number {
    return this.cameras.filter(camera => camera.status_Camera === 'blurry').length;
  }
}