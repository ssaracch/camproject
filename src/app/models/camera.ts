// camera.model.ts
export interface Camera {
  id_Camera?: number;              // auto-incrémenté, optionnel à la création
  nom_Camera: string;
  location: string;
  ip_adress: string;
  mac_adress: string;
  status_Camera: 'normal' | 'offline' | 'blurry';
  id_User: number;                 // correspond à la clé étrangère
  id_Groupe: number;              // correspond à la clé étrangère
}
