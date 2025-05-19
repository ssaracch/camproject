export interface Camera {
  id: number;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'blurred';
  userId: number;
  userName: string;
}
