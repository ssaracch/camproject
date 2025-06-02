import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface Camera {
  id_Camera: string;
  nom_Camera: string;
  location: string;
  ip_adress: string;
  mac_adress: string;
  status_Camera: 'normal' | 'offline' | 'blurry';
  id_User: string;
  id_Groupe: string;
  dateCreation?: string;
}

@Component({
  selector: 'app-camera-list',
  standalone: false,
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.css']
})
export class CameraListComponent implements OnInit {

  cameras: Camera[] = [
    {
      id_Camera: 'CAM001',
      nom_Camera: 'Caméra Entrée',
      location: 'Hall Principal',
      ip_adress: '192.168.1.10',
      mac_adress: '00:1A:2B:3C:4D:5E',
      status_Camera: 'normal',
      id_User: 'USER001',
      id_Groupe: 'GROUPE001',
      dateCreation: '2024-01-15'
    },
    {
      id_Camera: 'CAM002',
      nom_Camera: 'Caméra Parking',
      location: 'Parking Nord',
      ip_adress: '192.168.1.11',
      mac_adress: '00:1A:2B:3C:4D:5F',
      status_Camera: 'offline',
      id_User: 'USER002',
      id_Groupe: 'GROUPE002',
      dateCreation: '2024-01-10'
    },
    {
      id_Camera: 'CAM003',
      nom_Camera: 'Caméra Bureau',
      location: 'Bureau Direction',
      ip_adress: '192.168.1.12',
      mac_adress: '00:1A:2B:3C:4D:60',
      status_Camera: 'blurry',
      id_User: 'USER003',
      id_Groupe: 'GROUPE001',
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
      ip_adress: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
      mac_adress: ['', [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)]],
      status_Camera: ['', Validators.required],
      id_User: ['', Validators.required],
      id_Groupe: ['', Validators.required],
      dateCreation: ['', Validators.required]
    });
  }

  filterCameras(): void {
    this.filteredCameras = this.selectedStatus === 'all'
      ? [...this.cameras]
      : this.cameras.filter(c => c.status_Camera === this.selectedStatus);
  }

  openAddModal(cameraModalTemplate: TemplateRef<any>) {
  this.isEditMode = false;
  this.cameraForm.reset();
  this.modalService.open(cameraModalTemplate, { size: 'lg' });
}

  openEditModal(editModalTemplate: TemplateRef<any>, camera: any) {
  this.isEditMode = true;
  // Patch les valeurs dans le formulaire
  this.cameraForm.patchValue({
    nom_Camera: camera.nom_Camera,
    location: camera.location,
    ip_adress: camera.ip_adress,
    mac_adress: camera.mac_adress,
    dateCreation: camera.dateCreation ? camera.dateCreation.split('T')[0] : '', // pour date input
    status_Camera: camera.status_Camera,
    id_User: camera.id_User,
    id_Groupe: camera.id_Groupe
  });

  // Ouvre la modal
  this.modalService.open(editModalTemplate, { size: 'lg' });
}



  private populateForm(camera: Camera): void {
    this.cameraForm.patchValue({
      nom_Camera: camera.nom_Camera,
      location: camera.location,
      ip_adress: camera.ip_adress,
      mac_adress: camera.mac_adress,
      status_Camera: camera.status_Camera,
      id_User: camera.id_User,
      id_Groupe: camera.id_Groupe,
      dateCreation: camera.dateCreation || new Date().toISOString().split('T')[0]
    });
  }

  private resetForm(): void {
    this.cameraForm.reset();
    this.cameraForm.patchValue({
      dateCreation: new Date().toISOString().split('T')[0]
    });
  }

  saveCamera(): void {
    if (this.cameraForm.valid) {
      const formValue = this.cameraForm.value;

      if (this.isEditMode && this.currentCamera) {
        const index = this.cameras.findIndex(c => c.id_Camera === this.currentCamera!.id_Camera);
        if (index !== -1) {
          this.cameras[index] = {
            ...this.currentCamera,
            ...formValue
          };
        }
      } else {
        const newCamera: Camera = {
          id_Camera: this.generateCameraId(),
          ...formValue
        };
        this.cameras.push(newCamera);
      }

      this.filterCameras();
      this.closeModal();
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteCamera(camera: Camera): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la caméra "${camera.nom_Camera}" ?`)) {
      this.cameras = this.cameras.filter(c => c.id_Camera !== camera.id_Camera);
      this.filterCameras();
    }
  }

  private closeModal(): void {
    this.modalRef?.close();
    this.modalRef = null;
  }

  private generateCameraId(): string {
    const maxId = this.cameras.reduce((max, c) => {
      const numericId = parseInt(c.id_Camera.replace('CAM', ''), 10);
      return Math.max(max, numericId);
    }, 0);
    return `CAM${String(maxId + 1).padStart(3, '0')}`;
  }

  private markFormGroupTouched(): void {
    Object.values(this.cameraForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cameraForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['minlength']) {
        return `${fieldName} doit contenir au moins ${field.errors['minlength'].requiredLength} caractères`;
      }
      if (field.errors['pattern']) return `${fieldName} a un format invalide`;
    }
    return '';
  }

  onSubmit(): void {
    this.saveCamera();
  }

  // Getters
  get nom_Camera() {
    return this.cameraForm.get('nom_Camera');
  }

  get location() {
    return this.cameraForm.get('location');
  }

  get ip_adress() {
    return this.cameraForm.get('ip_adress');
  }

  get mac_adress() {
    return this.cameraForm.get('mac_adress');
  }

  get status_Camera() {
    return this.cameraForm.get('status_Camera');
  }

  get id_User() {
    return this.cameraForm.get('id_User');
  }

  get id_Groupe() {
    return this.cameraForm.get('id_Groupe');
  }

  get dateCreation() {
    return this.cameraForm.get('dateCreation');
  }

  // Statistiques
  get activeCameras(): number {
    return this.cameras.filter(c => c.status_Camera === 'normal').length;
  }

  get offlineCameras(): number {
    return this.cameras.filter(c => c.status_Camera === 'offline').length;
  }

  get blurryCameras(): number {
    return this.cameras.filter(c => c.status_Camera === 'blurry').length;
  }
}
