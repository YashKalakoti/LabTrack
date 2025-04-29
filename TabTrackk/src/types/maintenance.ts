
export interface MaintenanceLog {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  type: 'routine' | 'repair' | 'calibration' | 'inspection';
  description: string;
  technician: string;
  notes?: string;
}
