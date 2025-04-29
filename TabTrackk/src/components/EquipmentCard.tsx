
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onBook: (equipment: Equipment) => void;
  onViewHistory: (equipment: Equipment) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ 
  equipment, 
  onEdit, 
  onBook, 
  onViewHistory 
}) => {
  const getStatusClass = () => {
    switch (equipment.status) {
      case 'available':
        return 'status-available';
      case 'in-use':
        return 'status-in-use';
      case 'maintenance':
        return 'status-maintenance';
      default:
        return 'status-unavailable';
    }
  };

  const getStatusText = () => {
    return equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1).replace('-', ' ');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{equipment.name}</h3>
            <p className="text-sm text-muted-foreground">ID: {equipment.id}</p>
          </div>
          <Badge className={getStatusClass()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{equipment.location}</p>
          </div>
          {equipment.lastMaintenance && (
            <div>
              <p className="text-sm font-medium">Last Maintenance</p>
              <p className="text-sm text-muted-foreground">
                {new Date(equipment.lastMaintenance).toLocaleDateString()}
              </p>
            </div>
          )}
          {equipment.nextMaintenance && (
            <div>
              <p className="text-sm font-medium">Next Maintenance</p>
              <p className="text-sm text-muted-foreground">
                {new Date(equipment.nextMaintenance).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {equipment.status === 'available' && (
          <Button 
            variant="default" 
            size="sm"
            className="flex-1"
            onClick={() => onBook(equipment)}
          >
            Book Now
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onViewHistory(equipment)}
        >
          History
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={() => onEdit(equipment)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EquipmentCard;
