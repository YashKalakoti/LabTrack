
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Equipment } from '@/types/equipment';
import { Booking } from '@/types/booking';
import { MaintenanceLog } from '@/types/maintenance';

// Sample data for analytics
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

// Generate sample booking data for the past 6 months
const generateSampleBookings = (): Booking[] => {
  const bookings: Booking[] = [];
  const equipmentIds = sampleEquipment.map(eq => eq.id);
  const equipmentNames = sampleEquipment.map(eq => eq.name);
  const users = ['Jane Smith', 'John Doe', 'Alex Johnson', 'Maria Rodriguez', 'David Kim'];
  
  // Generate bookings for each month in the past 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    // Generate random number of bookings for this month
    const numBookings = 5 + Math.floor(Math.random() * 10); // 5-14 bookings per month
    
    for (let j = 0; j < numBookings; j++) {
      const equipIndex = Math.floor(Math.random() * equipmentIds.length);
      const userIndex = Math.floor(Math.random() * users.length);
      
      const day = Math.floor(Math.random() * 28) + 1;
      const hour = 8 + Math.floor(Math.random() * 8); // 8am-4pm
      
      const startDate = new Date(date.getFullYear(), date.getMonth(), day, hour);
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1 + Math.floor(Math.random() * 3)); // 1-3 hour bookings
      
      bookings.push({
        id: `BK-${bookings.length + 1}`,
        equipmentId: equipmentIds[equipIndex],
        equipmentName: equipmentNames[equipIndex],
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        purpose: `Sample testing ${j+1}`,
        userId: `user-${userIndex+1}`,
        userName: users[userIndex],
        createdAt: new Date(startDate.getTime() - 86400000 * Math.floor(Math.random() * 7)).toISOString(), // Created 0-6 days before
      });
    }
  }
  
  return bookings;
};

const sampleBookings = generateSampleBookings();

// Generate sample maintenance logs
const sampleMaintenanceLogs: MaintenanceLog[] = [
  {
    id: 'ML-001',
    equipmentId: 'EQ-001',
    equipmentName: 'Microscope XL-5000',
    date: '2023-09-10T09:00:00.000Z',
    type: 'routine',
    description: 'Regular maintenance',
    technician: 'Michael Chen',
  },
  {
    id: 'ML-002',
    equipmentId: 'EQ-002',
    equipmentName: 'Centrifuge CR-200',
    date: '2023-08-15T14:30:00.000Z',
    type: 'repair',
    description: 'Rotor issue',
    technician: 'Sarah Wilson',
  },
  {
    id: 'ML-003',
    equipmentId: 'EQ-003',
    equipmentName: 'PCR Thermal Cycler',
    date: '2023-11-05T10:15:00.000Z',
    type: 'calibration',
    description: 'Temperature calibration',
    technician: 'David Lopez',
  },
  {
    id: 'ML-004',
    equipmentId: 'EQ-004',
    equipmentName: 'Spectrophotometer',
    date: '2023-10-12T13:00:00.000Z',
    type: 'inspection',
    description: 'Annual safety inspection',
    technician: 'Jennifer Park',
  },
  {
    id: 'ML-005',
    equipmentId: 'EQ-005',
    equipmentName: 'pH Meter',
    date: '2023-11-20T11:30:00.000Z',
    type: 'calibration',
    description: 'Electrode calibration',
    technician: 'Robert Johnson',
  },
  {
    id: 'ML-006',
    equipmentId: 'EQ-006',
    equipmentName: 'Analytical Balance',
    date: '2023-09-30T09:45:00.000Z',
    type: 'routine',
    description: 'Regular calibration',
    technician: 'Lisa Thompson',
  },
  {
    id: 'ML-007',
    equipmentId: 'EQ-003',
    equipmentName: 'PCR Thermal Cycler',
    date: '2024-04-29T14:00:00.000Z',
    type: 'repair',
    description: 'Display screen replacement',
    technician: 'David Lopez',
  },
  {
    id: 'ML-008',
    equipmentId: 'EQ-004',
    equipmentName: 'Spectrophotometer',
    date: '2024-01-15T10:00:00.000Z',
    type: 'calibration',
    description: 'Wavelength calibration',
    technician: 'Jennifer Park',
  },
  {
    id: 'ML-009',
    equipmentId: 'EQ-001',
    equipmentName: 'Microscope XL-5000',
    date: '2024-02-20T09:30:00.000Z',
    type: 'routine',
    description: 'Lens cleaning and inspection',
    technician: 'Michael Chen',
  },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('usage');

  // Chart colors
  const colors = {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#ea384c',
    info: '#2196F3',
    chart: ['#9b87f5', '#7E69AB', '#D6BCFA', '#4CAF50', '#FF9800', '#ea384c']
  };

  // Calculate status distribution for equipment
  const statusCounts = sampleEquipment.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = [
    { name: 'Available', value: statusCounts.available || 0 },
    { name: 'In Use', value: statusCounts['in-use'] || 0 },
    { name: 'Maintenance', value: statusCounts.maintenance || 0 },
    { name: 'Unavailable', value: statusCounts.unavailable || 0 },
  ];

  // Calculate equipment usage frequency (number of bookings per equipment)
  const equipmentUsage = sampleBookings.reduce((acc, booking) => {
    acc[booking.equipmentName] = (acc[booking.equipmentName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const usageData = Object.entries(equipmentUsage)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Calculate monthly booking trends
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'short' });
  };

  const bookingTrends = sampleBookings.reduce((acc, booking) => {
    const date = new Date(booking.startTime);
    const monthYear = `${getMonthName(date)} ${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort by date
  const trendData = Object.entries(bookingTrends)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      return aDate.getTime() - bDate.getTime();
    });

  // Calculate maintenance type distribution
  const maintenanceTypes = sampleMaintenanceLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maintenanceData = [
    { name: 'Routine', value: maintenanceTypes.routine || 0 },
    { name: 'Repair', value: maintenanceTypes.repair || 0 },
    { name: 'Calibration', value: maintenanceTypes.calibration || 0 },
    { name: 'Inspection', value: maintenanceTypes.inspection || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleEquipment.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {Array.from(new Set(sampleEquipment.map(eq => eq.location.split(',')[0]))).length} lab locations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              In the past 6 months
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Equipment Under Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.maintenance || 0}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((statusCounts.maintenance || 0) / sampleEquipment.length) * 100)}% of total equipment
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="status">Equipment Status</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Booking Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke={colors.primary} 
                    name="Bookings" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Used Equipment</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Bookings" fill={colors.primary} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipment by Location</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Group by location */}
                {(() => {
                  const locationCounts = sampleEquipment.reduce((acc, item) => {
                    const location = item.location.split(',')[0].trim();
                    acc[location] = (acc[location] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const locationData = Object.entries(locationCounts)
                    .map(([name, value]) => ({ name, value }));
                  
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} items`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Type Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maintenanceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {maintenanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} instances`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance by Equipment</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Group by equipment */}
                {(() => {
                  const equipmentMaintenance = sampleMaintenanceLogs.reduce((acc, log) => {
                    acc[log.equipmentName] = (acc[log.equipmentName] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const maintenanceByEquipment = Object.entries(equipmentMaintenance)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);
                  
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={maintenanceByEquipment}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Maintenance Records" fill={colors.warning} />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
