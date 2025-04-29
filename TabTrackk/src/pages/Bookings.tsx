
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar as CalendarIcon, User, Clock, Edit } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isToday, isThisWeek, isThisMonth, parseISO, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Booking } from '@/types/booking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample bookings data
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
  {
    id: 'BK-003',
    equipmentId: 'EQ-001',
    equipmentName: 'Microscope XL-5000',
    startTime: '2024-05-02T10:00:00.000Z',
    endTime: '2024-05-02T12:00:00.000Z',
    purpose: 'Cell morphology study',
    userId: 'user-003',
    userName: 'Alex Johnson',
    createdAt: '2024-04-30T09:45:00.000Z',
  },
  {
    id: 'BK-004',
    equipmentId: 'EQ-004',
    equipmentName: 'Spectrophotometer',
    startTime: '2024-05-03T14:00:00.000Z',
    endTime: '2024-05-03T16:30:00.000Z',
    purpose: 'Absorption measurements for compound analysis',
    userId: 'user-004',
    userName: 'Maria Rodriguez',
    createdAt: '2024-04-29T16:30:00.000Z',
  },
  {
    id: 'BK-005',
    equipmentId: 'EQ-005',
    equipmentName: 'pH Meter',
    startTime: '2024-05-04T09:30:00.000Z',
    endTime: '2024-05-04T10:30:00.000Z',
    purpose: 'pH calibration for buffer solutions',
    userId: 'user-005',
    userName: 'David Kim',
    createdAt: '2024-04-30T11:15:00.000Z',
  }
];

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  const startDate = parseISO(booking.startTime);
  const endDate = parseISO(booking.endTime);
  const isPast = new Date() > endDate;
  const isOngoing = new Date() >= startDate && new Date() <= endDate;
  
  // Format time range
  const timeRange = `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
  
  return (
    <Card className={cn(
      "transition-all",
      isPast ? "opacity-70" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{booking.equipmentName}</CardTitle>
          <Badge className={
            isPast ? "bg-muted text-muted-foreground" : 
            isOngoing ? "bg-success text-success-foreground" : 
            "bg-primary text-primary-foreground"
          }>
            {isPast ? "Completed" : isOngoing ? "Ongoing" : "Upcoming"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(startDate, 'EEEE, MMM d, yyyy')}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{timeRange}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{booking.userName}</span>
          </div>
          
          <div className="mt-2">
            <p className="text-sm font-medium">Purpose:</p>
            <p className="text-sm text-muted-foreground">{booking.purpose}</p>
          </div>
          
          <div className="mt-2 flex justify-end">
            <Button variant="ghost" size="sm" className="flex items-center">
              <Edit className="mr-1 h-3 w-3" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Bookings: React.FC = () => {
  const [bookings] = useState<Booking[]>(sampleBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('all');

  // Filter bookings based on search term, selected date, and active tab
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      !searchTerm || 
      booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const bookingDate = parseISO(booking.startTime);
    const matchesDate = !selectedDate || isSameDay(bookingDate, selectedDate);
    
    let matchesTab = true;
    if (activeTab === 'today') {
      matchesTab = isToday(bookingDate);
    } else if (activeTab === 'week') {
      matchesTab = isThisWeek(bookingDate);
    } else if (activeTab === 'month') {
      matchesTab = isThisMonth(bookingDate);
    }
    
    return matchesSearch && matchesDate && matchesTab;
  });

  // Sort bookings by start time
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipment Bookings</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setActiveTab('all');
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              {selectedDate && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => {
          setActiveTab(value);
          setSelectedDate(undefined);
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {sortedBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border p-6">
              <p className="text-lg text-center text-muted-foreground">
                No bookings found matching your criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDate(undefined);
                  setActiveTab('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
