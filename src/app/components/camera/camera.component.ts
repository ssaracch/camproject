import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-camera',
  standalone: false,
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent {


  @ViewChild('videoElement') videoElement!: ElementRef;
  isCameraOn = false;
  stream: MediaStream | null = null;

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      this.videoElement.nativeElement.srcObject = this.stream;
      this.isCameraOn = true;
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access the camera');
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.isCameraOn = false;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}

