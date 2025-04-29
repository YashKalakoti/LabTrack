
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isSameDay, addDays } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Equipment } from '@/types/equipment';
import { Booking } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

interface BookingDialogProps {
  equipment: Equipment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (booking: Booking) => void;
  existingBookings: Booking[];
}

const BookingDialog: React.FC<BookingDialogProps> = ({
  equipment,
  open,
  onOpenChange,
  onBook,
  existingBookings
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [purpose, setPurpose] = useState('');

  // Generate time options from 8 AM to 6 PM
  const timeOptions = [];
  for (let hour = 8; hour <= 18; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    timeOptions.push(`${hourStr}:00`);
    if (hour < 18) timeOptions.push(`${hourStr}:30`);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !purpose) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Check if start time is before end time
    if (startTime >= endTime) {
      toast({
        title: "Invalid Time Range",
        description: "Start time must be before end time.",
        variant: "destructive"
      });
      return;
    }

    // Check for booking conflicts
    const bookingDate = date.toISOString().split('T')[0];
    const hasConflict = existingBookings.some(booking => {
      const bookingStartDate = new Date(booking.startTime).toISOString().split('T')[0];
      if (bookingDate !== bookingStartDate) return false;
      
      const newStartTime = `${bookingDate}T${startTime}:00`;
      const newEndTime = `${bookingDate}T${endTime}:00`;
      
      const existingStart = new Date(booking.startTime).toISOString();
      const existingEnd = new Date(booking.endTime).toISOString();
      
      return (
        (newStartTime >= existingStart && newStartTime < existingEnd) ||
        (newEndTime > existingStart && newEndTime <= existingEnd) ||
        (newStartTime <= existingStart && newEndTime >= existingEnd)
      );
    });

    if (hasConflict) {
      toast({
        title: "Booking Conflict",
        description: "This equipment is already booked during the selected time.",
        variant: "destructive"
      });
      return;
    }

    // Create booking
    const startDateTime = new Date(date);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(date);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const newBooking: Booking = {
      id: `BK-${Date.now().toString(36)}`,
      equipmentId: equipment!.id,
      equipmentName: equipment!.name,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      purpose,
      userId: 'current-user', // In a real app, this would be the logged-in user's ID
      userName: 'Current User', // In a real app, this would be the logged-in user's name
      createdAt: new Date().toISOString(),
    };

    onBook(newBooking);
    toast({
      title: "Booking Successful",
      description: `${equipment?.name} has been booked for ${format(date, 'PP')} from ${startTime} to ${endTime}.`
    });
    onOpenChange(false);
  };

  // Function to disable dates that are in the past
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Equipment: {equipment?.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={disabledDays}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {timeOptions.map((time) => (
                    <option key={`end-${time}`} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Booking Purpose *</Label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Please describe why you need this equipment"
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Book Equipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
