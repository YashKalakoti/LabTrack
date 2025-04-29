
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaintenanceLog } from '@/types/maintenance';
import { Search, Plus, Settings, Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Equipment } from '@/types/equipment';
import { useToast } from '@/hooks/use-toast';

// Sample maintenance logs
const sampleMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'ML-001',
    equipmentId: 'EQ-001',
    equipmentName: 'Microscope XL-5000',
    date: '2023-09-10T09:00:00.000Z',
    type: 'routine',
    description: 'Regular maintenance - lens cleaning and calibration',
    technician: 'Michael Chen',
    notes: 'All components functioning properly. Replaced eyepiece cushions.'
  },
  {
    id: 'ML-002',
    equipmentId: 'EQ-002',
    equipmentName: 'Centrifuge CR-200',
    date: '2023-08-15T14:30:00.000Z',
    type: 'repair',
    description: 'Rotor imbalance issue fixed',
    technician: 'Sarah Wilson',
    notes: 'Replaced worn-out rubber mounts and recalibrated the balance sensor.'
  },
  {
    id: 'ML-003',
    equipmentId: 'EQ-003',
    equipmentName: 'PCR Thermal Cycler',
    date: '2023-11-05T10:15:00.000Z',
    type: 'calibration',
    description: 'Temperature calibration and verification',
    technician: 'David Lopez',
    notes: 'Adjusted temperature offset by +0.3°C. Verified with calibration kit.'
  },
  {
    id: 'ML-004',
    equipmentId: 'EQ-004',
    equipmentName: 'Spectrophotometer',
    date: '2023-10-12T13:00:00.000Z',
    type: 'inspection',
    description: 'Annual safety inspection',
    technician: 'Jennifer Park',
    notes: 'Passed all safety checks. Updated firmware to version 3.5.2.'
  },
  {
    id: 'ML-005',
    equipmentId: 'EQ-005',
    equipmentName: 'pH Meter',
    date: '2023-11-20T11:30:00.000Z',
    type: 'calibration',
    description: 'Electrode calibration',
    technician: 'Robert Johnson',
    notes: 'Calibrated with pH 4.0, 7.0, and 10.0 buffers. Electrode response time normal.'
  },
  {
    id: 'ML-006',
    equipmentId: 'EQ-006',
    equipmentName: 'Analytical Balance',
    date: '2023-09-30T09:45:00.000Z',
    type: 'routine',
    description: 'Regular cleaning and calibration',
    technician: 'Lisa Thompson',
    notes: 'Cleaned weighing chamber. Calibrated with certified weights.'
  },
  {
    id: 'ML-007',
    equipmentId: 'EQ-003',
    equipmentName: 'PCR Thermal Cycler',
    date: '2024-04-29T14:00:00.000Z',
    type: 'repair',
    description: 'Display screen replacement',
    technician: 'David Lopez',
    notes: 'Replaced malfunctioning LCD screen. Tested all functions after repair.'
  }
];

// Sample equipment for the maintenance form
const sampleEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'Microscope XL-5000',
    location: 'Lab A, Bench 3',
    status: 'available',
    addedDate: '2023-03-15T00:00:00.000Z',
    lastMaintenance: '2023-09-10T00:00:00.000Z',
    nextMaintenance: '2024-03-10T00:00:00.000Z',
  },
  {
    id: 'EQ-002',
    name: 'Centrifuge CR-200',
    location: 'Lab B, Station 1',
    status: 'in-use',
    addedDate: '2023-01-20T00:00:00.000Z',
    lastMaintenance: '2023-08-15T00:00:00.000Z',
    nextMaintenance: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'EQ-003',
    name: 'PCR Thermal Cycler',
    location: 'Lab C, Bench 2',
    status: 'maintenance',
    addedDate: '2023-05-10T00:00:00.000Z',
    lastMaintenance: '2023-11-05T00:00:00.000Z',
    nextMaintenance: '2024-05-05T00:00:00.000Z',
  },
  {
    id: 'EQ-004',
    name: 'Spectrophotometer',
    location: 'Lab A, Bench 5',
    status: 'available',
    addedDate: '2023-02-05T00:00:00.000Z',
    lastMaintenance: '2023-10-12T00:00:00.000Z',
    nextMaintenance: '2024-04-12T00:00:00.000Z',
  },
  {
    id: 'EQ-005',
    name: 'pH Meter',
    location: 'Lab B, Station 3',
    status: 'available',
    addedDate: '2023-04-25T00:00:00.000Z',
    lastMaintenance: '2023-11-20T00:00:00.000Z',
    nextMaintenance: '2024-05-20T00:00:00.000Z',
  },
  {
    id: 'EQ-006',
    name: 'Analytical Balance',
    location: 'Lab C, Bench 1',
    status: 'in-use',
    addedDate: '2023-03-30T00:00:00.000Z',
    lastMaintenance: '2023-09-30T00:00:00.000Z',
    nextMaintenance: '2024-03-30T00:00:00.000Z',
  },
];

interface MaintenanceCardProps {
  log: MaintenanceLog;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ log }) => {
  const getTypeColor = () => {
    switch (log.type) {
      case 'routine':
        return 'bg-info text-info-foreground';
      case 'repair':
        return 'bg-warning text-warning-foreground';
      case 'calibration':
        return 'bg-primary text-primary-foreground';
      case 'inspection':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeText = () => {
    return log.type.charAt(0).toUpperCase() + log.type.slice(1);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{log.equipmentName}</h3>
            <p className="text-sm text-muted-foreground">ID: {log.equipmentId}</p>
          </div>
          <Badge className={getTypeColor()}>
            {getTypeText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(parseISO(log.date), 'PPP')}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Technician: {log.technician}</span>
          </div>
          
          <div className="mt-2">
            <p className="text-sm font-medium">Description:</p>
            <p className="text-sm text-muted-foreground">{log.description}</p>
          </div>
          
          {log.notes && (
            <div className="mt-2">
              <p className="text-sm font-medium">Notes:</p>
              <p className="text-sm text-muted-foreground">{log.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MaintenanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (log: MaintenanceLog) => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit 
}) => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [maintenanceType, setMaintenanceType] = useState<'routine' | 'repair' | 'calibration' | 'inspection'>('routine');
  const [description, setDescription] = useState('');
  const [technician, setTechnician] = useState('');
  const [notes, setNotes] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEquipment || !description || !technician) {
      return;
    }
    
    const equipment = sampleEquipment.find((eq) => eq.id === selectedEquipment);
    
    if (equipment) {
      const newLog: MaintenanceLog = {
        id: `ML-${Date.now().toString(36)}`,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        date: new Date().toISOString(),
        type: maintenanceType,
        description,
        technician,
        notes: notes || undefined
      };
      
      onSubmit(newLog);
      resetForm();
      onOpenChange(false);
    }
  };
  
  const resetForm = () => {
    setSelectedEquipment('');
    setMaintenanceType('routine');
    setDescription('');
    setTechnician('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Maintenance Log</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipment *</Label>
            <Select
              value={selectedEquipment}
              onValueChange={setSelectedEquipment}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {sampleEquipment.map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} ({eq.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Maintenance Type *</Label>
            <Select
              value={maintenanceType}
              onValueChange={(value) => setMaintenanceType(value as any)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="calibration">Calibration</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of maintenance performed"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="technician">Technician Name *</Label>
            <Input
              id="technician"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Name of person performing maintenance"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Additional notes, observations, or follow-up actions"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Maintenance Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Maintenance: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<MaintenanceLog[]>(sampleMaintenanceLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filter logs based on search term
  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.equipmentName.toLowerCase().includes(term) ||
      log.equipmentId.toLowerCase().includes(term) ||
      log.description.toLowerCase().includes(term) ||
      log.technician.toLowerCase().includes(term) ||
      (log.notes && log.notes.toLowerCase().includes(term))
    );
  });
  
  // Sort logs by date, newest first
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddLog = (log: MaintenanceLog) => {
    setLogs((prev) => [log, ...prev]);
    toast({
      title: "Maintenance Log Added",
      description: `New maintenance record added for ${log.equipmentName}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">Maintenance Logs</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Maintenance Log
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search maintenance logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {sortedLogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLogs.map((log) => (
            <MaintenanceCard key={log.id} log={log} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border p-6">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-center text-muted-foreground">
            No maintenance logs found
          </p>
          <p className="text-sm text-center text-muted-foreground mt-2">
            {searchTerm ? 'Try a different search term' : 'Add your first maintenance log'}
          </p>
          {searchTerm && (
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
      
      <MaintenanceForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddLog}
      />
    </div>
  );
};

export default Maintenance;
