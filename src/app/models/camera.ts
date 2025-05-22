// camera.model.ts
export interface Camera {
  id_Camera?: number;
  nom_Camera: string;
  location: string;
  status_Camera: 'normal' | 'offline' | 'blurry';
  id_User: number;
}