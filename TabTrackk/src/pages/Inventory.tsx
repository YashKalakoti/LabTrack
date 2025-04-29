
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EquipmentCard from '@/components/EquipmentCard';
import EquipmentDialog from '@/components/EquipmentDialog';
import BookingDialog from '@/components/BookingDialog';
import { Equipment } from '@/types/equipment';
import { Booking } from '@/types/booking';
import { Search, Plus, Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Sample data
const sampleEquipment: Equipment[] = [
  {
    id: 'EQ-001',
    name: 'Microscope XL-5000',
    description: 'High-powered microscope with digital imaging capabilities',
    location: 'Lab A, Bench 3',
    status: 'available',
    addedDate: '2023-03-15T00:00:00.000Z',
    lastMaintenance: '2023-09-10T00:00:00.000Z',
    nextMaintenance: '2024-03-10T00:00:00.000Z',
  },
  {
    id: 'EQ-002',
    name: 'Centrifuge CR-200',
    description: 'High-speed centrifuge for sample preparation',
    location: 'Lab B, Station 1',
    status: 'in-use',
    addedDate: '2023-01-20T00:00:00.000Z',
    lastMaintenance: '2023-08-15T00:00:00.000Z',
    nextMaintenance: '2024-02-15T00:00:00.000Z',
  },
  {
    id: 'EQ-003',
    name: 'PCR Thermal Cycler',
    description: 'Precision thermal cycler for DNA amplification',
    location: 'Lab C, Bench 2',
    status: 'maintenance',
    addedDate: '2023-05-10T00:00:00.000Z',
    lastMaintenance: '2023-11-05T00:00:00.000Z',
    nextMaintenance: '2024-05-05T00:00:00.000Z',
  },
  {
    id: 'EQ-004',
    name: 'Spectrophotometer',
    description: 'UV-Vis spectrophotometer for analytical measurements',
    location: 'Lab A, Bench 5',
    status: 'available',
    addedDate: '2023-02-05T00:00:00.000Z',
    lastMaintenance: '2023-10-12T00:00:00.000Z',
    nextMaintenance: '2024-04-12T00:00:00.000Z',
  },
  {
    id: 'EQ-005',
    name: 'pH Meter',
    description: 'Digital pH meter with temperature compensation',
    location: 'Lab B, Station 3',
    status: 'available',
    addedDate: '2023-04-25T00:00:00.000Z',
    lastMaintenance: '2023-11-20T00:00:00.000Z',
    nextMaintenance: '2024-05-20T00:00:00.000Z',
  },
  {
    id: 'EQ-006',
    name: 'Analytical Balance',
    description: 'High-precision analytical balance',
    location: 'Lab C, Bench 1',
    status: 'in-use',
    addedDate: '2023-03-30T00:00:00.000Z',
    lastMaintenance: '2023-09-30T00:00:00.000Z',
    nextMaintenance: '2024-03-30T00:00:00.000Z',
  },
];

const sampleBookings: Booking[] = [
  {
    id: 'BK-001',
    equipmentId: 'EQ-002',
    equipmentName: 'Centrifuge CR-200',
    startTime: '2024-05-01T09:00:00.000Z',
    endTime: '2024-05-01T11:30:00.000Z',
    purpose: 'Sample preparation for protein analysis',
    userId: 'user-001',
    userName: 'Jane Smith',
    createdAt: '2024-04-28T15:23:00.000Z',
  },
  {
    id: 'BK-002',
    equipmentId: 'EQ-006',
    equipmentName: 'Analytical Balance',
    startTime: '2024-05-01T13:00:00.000Z',
    endTime: '2024-05-01T15:00:00.000Z',
    purpose: 'Weighing reagents for experiment',
    userId: 'user-002',
    userName: 'John Doe',
    createdAt: '2024-04-29T10:15:00.000Z',
  },
];

const Inventory: React.FC = () => {
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>(sampleEquipment);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(sampleEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Filter equipment based on search term and status filter
  useEffect(() => {
    let filtered = [...equipment];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) => 
          item.name.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          item.id.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    
    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, statusFilter]);

  const handleAddEquipment = () => {
    setSelectedEquipment(null);
    setIsEquipmentDialogOpen(true);
  };

  const handleEditEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsEquipmentDialogOpen(true);
  };

  const handleBookEquipment = (item: Equipment) => {
    setSelectedEquipment(item);
    setIsBookingDialogOpen(true);
  };

  const handleViewHistory = (item: Equipment) => {
    setSelectedEquipment(item);
    toast({
      title: "Feature in Development",
      description: "The equipment history view is coming soon.",
    });
    // In a complete implementation, we would open a history dialog or navigate to a history page
    // setIsHistoryDialogOpen(true);
  };

  const handleSaveEquipment = (item: Equipment) => {
    if (selectedEquipment) {
      // Update existing equipment
      setEquipment((prevEquipment) => 
        prevEquipment.map((eq) => eq.id === item.id ? item : eq)
      );
    } else {
      // Add new equipment
      setEquipment((prevEquipment) => [...prevEquipment, item]);
    }
  };

  const handleBookingSubmit = (booking: Booking) => {
    // Add new booking
    setBookings((prevBookings) => [...prevBookings, booking]);
    
    // Update equipment status to in-use
    if (selectedEquipment) {
      setEquipment((prevEquipment) => 
        prevEquipment.map((eq) => 
          eq.id === selectedEquipment.id ? { ...eq, status: 'in-use' } : eq
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <h1 className="text-2xl font-bold">Equipment Inventory</h1>
        <Button onClick={handleAddEquipment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onEdit={handleEditEquipment}
              onBook={handleBookEquipment}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border p-6">
          <p className="text-lg text-center text-muted-foreground">
            No equipment found matching your search criteria
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Equipment Dialog */}
      <EquipmentDialog
        equipment={selectedEquipment}
        open={isEquipmentDialogOpen}
        onOpenChange={setIsEquipmentDialogOpen}
        onSave={handleSaveEquipment}
      />

      {/* Booking Dialog */}
      <BookingDialog
        equipment={selectedEquipment}
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        onBook={handleBookingSubmit}
        existingBookings={bookings.filter(
          (booking) => booking.equipmentId === selectedEquipment?.id
        )}
      />
      
      {/* In a complete implementation, we would have a history dialog here */}
    </div>
  );
};

export default Inventory;
