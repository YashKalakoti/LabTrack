
export interface Equipment {
  id: string;
  name: string;
  description?: string;
  location: string;
  status: 'available' | 'in-use' | 'maintenance' | 'unavailable';
  addedDate: string;
  lastMaintenance: string | null;
  nextMaintenance: string | null;
}
