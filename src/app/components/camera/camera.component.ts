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

  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
Captureframe() {
  const video = this.videoElement.nativeElement as HTMLVideoElement;
  const canvas = this.canvasElement.nativeElement;
  const context = canvas.getContext('2d');

  if (!context) {
    console.error('Canvas context not available');
    return;
  }

  // Adapter la taille du canvas à la vidéo
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Dessiner le cadre actuel de la vidéo sur le canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convertir le canvas en image (base64)
  const imageData = canvas.toDataURL('image/png');
  console.log('Captured frame as base64 image:', imageData);

  // Optionnel : télécharger l’image automatiquement
  const link = document.createElement('a');
  link.href = imageData;
  link.download = 'captured_frame.png';
  link.click();
}

}

