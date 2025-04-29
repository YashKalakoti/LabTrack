
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface EquipmentDialogProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (equipment: Equipment) => void;
}

const EquipmentDialog: React.FC<EquipmentDialogProps> = ({
  equipment,
  open,
  onOpenChange,
  onSave
}) => {
  const { toast } = useToast();
  const isNewEquipment = !equipment?.id;
  const [formData, setFormData] = React.useState<Partial<Equipment>>({
    name: '',
    location: '',
    status: 'available',
    description: '',
  });

  React.useEffect(() => {
    if (equipment) {
      setFormData({ ...equipment });
    } else {
      setFormData({
        name: '',
        location: '',
        status: 'available',
        description: '',
      });
    }
  }, [equipment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const equipmentData = {
      id: equipment?.id || `EQ-${Date.now().toString(36)}`,
      name: formData.name!,
      location: formData.location!,
      status: formData.status || 'available',
      description: formData.description || '',
      addedDate: equipment?.addedDate || new Date().toISOString(),
      lastMaintenance: formData.lastMaintenance || null,
      nextMaintenance: formData.nextMaintenance || null,
    } as Equipment;

    onSave(equipmentData);
    toast({
      title: isNewEquipment ? "Equipment Added" : "Equipment Updated",
      description: `${formData.name} has been ${isNewEquipment ? 'added to' : 'updated in'} inventory.`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isNewEquipment ? 'Add New Equipment' : 'Edit Equipment'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Equipment Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Microscope"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="Lab A, Shelf 2"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status || 'available'}
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Brief description of the equipment"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isNewEquipment ? 'Add Equipment' : 'Update Equipment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentDialog;
