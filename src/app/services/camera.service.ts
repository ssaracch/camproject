import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private apiUrl = 'http://localhost:3000/cameras'; // Your API URL

  constructor(private http: HttpClient) { }

  
  getCameras(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCamera(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addCamera(camera: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, camera);
  }

  updateCamera(camera: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${camera.id}`, camera);
  }

  deleteCamera(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
