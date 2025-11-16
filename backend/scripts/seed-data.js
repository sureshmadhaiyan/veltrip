const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// You'll need to get an admin token first by logging in
// First create an admin user using: node scripts/create-admin.js
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@veltrip.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let authToken = '';

// Helper function to make authenticated requests
async function apiRequest(method, endpoint, data = null) {
  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(data && { data }),
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

// Login as admin
async function login() {
  console.log('Logging in as admin...');
  const response = await apiRequest('POST', '/auth/login', {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  authToken = response.accessToken;
  console.log('✓ Logged in successfully');
}

// Create companies
async function createCompanies() {
  console.log('\nCreating companies...');
  const companies = [
    {
      name: 'Veltrip Premium Cabs',
      domain: 'veltrip.com',
      subdomain: 'premium',
      email: 'contact@veltrip.com',
      phone: '+91-9876543210',
      address: '123 Main Street, Bangalore',
      city: 'Bangalore',
      state: 'Karnataka',
    },
    {
      name: 'City Taxi Services',
      domain: 'citytaxi.com',
      subdomain: 'city',
      email: 'info@citytaxi.com',
      phone: '+91-9876543211',
      address: '456 Park Avenue, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
    },
  ];

  const createdCompanies = [];
  for (const company of companies) {
    try {
      const result = await apiRequest('POST', '/companies', company);
      createdCompanies.push(result);
      console.log(`✓ Created company: ${company.name}`);
    } catch (error) {
      console.log(`✗ Failed to create company: ${company.name}`);
    }
  }
  return createdCompanies;
}

// Create passengers
async function createPassengers(companyId) {
  console.log('\nCreating passengers...');
  const passengers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '+91-9876543201',
      gender: 'MALE',
      dateOfBirth: '1990-01-15',
      role: 'CUSTOMER',
      companyId,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      phone: '+91-9876543202',
      gender: 'FEMALE',
      dateOfBirth: '1992-05-20',
      role: 'CUSTOMER',
      companyId,
    },
    {
      firstName: 'Robert',
      lastName: 'Johnson',
      email: 'robert.j@example.com',
      password: 'password123',
      phone: '+91-9876543203',
      gender: 'MALE',
      dateOfBirth: '1988-11-10',
      role: 'CUSTOMER',
      companyId,
    },
  ];

  const createdPassengers = [];
  for (const passenger of passengers) {
    try {
      const result = await apiRequest('POST', '/users', passenger);
      createdPassengers.push(result);
      console.log(`✓ Created passenger: ${passenger.firstName} ${passenger.lastName}`);
    } catch (error) {
      console.log(`✗ Failed to create passenger: ${passenger.firstName} ${passenger.lastName}`);
    }
  }
  return createdPassengers;
}

// Create vehicles
async function createVehicles(companyId) {
  console.log('\nCreating vehicles...');
  const vehicles = [
    {
      vehicleNumber: 'KA01AB1234',
      vehicleType: 'sedan',
      vehicleModel: 'Toyota Camry',
      vehicleColor: 'White',
      year: 2020,
      status: 'ACTIVE',
      companyId,
    },
    {
      vehicleNumber: 'KA01CD5678',
      vehicleType: 'suv',
      vehicleModel: 'Toyota Fortuner',
      vehicleColor: 'Black',
      year: 2021,
      status: 'ACTIVE',
      companyId,
    },
    {
      vehicleNumber: 'KA01EF9012',
      vehicleType: 'hatchback',
      vehicleModel: 'Maruti Swift',
      vehicleColor: 'Red',
      year: 2019,
      status: 'ACTIVE',
      companyId,
    },
  ];

  const createdVehicles = [];
  for (const vehicle of vehicles) {
    try {
      const result = await apiRequest('POST', '/vehicles', vehicle);
      createdVehicles.push(result);
      console.log(`✓ Created vehicle: ${vehicle.vehicleNumber}`);
    } catch (error) {
      console.log(`✗ Failed to create vehicle: ${vehicle.vehicleNumber}`);
    }
  }
  return createdVehicles;
}

// Create drivers
async function createDrivers(companyId, vehicles) {
  console.log('\nCreating drivers...');
  const drivers = [
    {
      firstName: 'Raj',
      lastName: 'Kumar',
      email: 'raj.kumar@example.com',
      password: 'password123',
      phone: '+91-9876543301',
      gender: 'MALE',
      dateOfBirth: '1985-03-15',
      licenseNumber: 'DL123456789',
      photo: 'https://via.placeholder.com/200',
      vehicleId: vehicles[0]?.id,
      companyId,
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      password: 'password123',
      phone: '+91-9876543302',
      gender: 'FEMALE',
      dateOfBirth: '1990-07-22',
      licenseNumber: 'DL987654321',
      photo: 'https://via.placeholder.com/200',
      vehicleId: vehicles[1]?.id,
      companyId,
    },
    {
      firstName: 'Amit',
      lastName: 'Patel',
      email: 'amit.patel@example.com',
      password: 'password123',
      phone: '+91-9876543303',
      gender: 'MALE',
      dateOfBirth: '1987-12-05',
      licenseNumber: 'DL456789123',
      photo: 'https://via.placeholder.com/200',
      vehicleId: vehicles[2]?.id,
      companyId,
    },
  ];

  const createdDrivers = [];
  for (const driver of drivers) {
    try {
      const result = await apiRequest('POST', '/drivers/with-user', driver);
      createdDrivers.push(result);
      console.log(`✓ Created driver: ${driver.firstName} ${driver.lastName}`);
    } catch (error) {
      console.log(`✗ Failed to create driver: ${driver.firstName} ${driver.lastName}`);
    }
  }
  return createdDrivers;
}

// Create bookings/trips
async function createBookings(companyId, passengers, drivers) {
  console.log('\nCreating bookings...');
  const bookings = [
    {
      customerId: passengers[0]?.id,
      driverId: drivers[0]?.id,
      companyId,
      pickupAddress: '123 MG Road, Bangalore',
      dropAddress: '456 Airport Road, Bangalore',
      pickupLatitude: 12.9716,
      pickupLongitude: 77.5946,
      dropLatitude: 12.9498,
      dropLongitude: 77.6682,
      startingKm: 1000.5,
      endingKm: 1025.3,
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      customerId: passengers[1]?.id,
      driverId: drivers[1]?.id,
      companyId,
      pickupAddress: '789 Commercial Street, Bangalore',
      dropAddress: '321 Mall Road, Bangalore',
      pickupLatitude: 12.9750,
      pickupLongitude: 77.6093,
      dropLatitude: 12.9352,
      dropLongitude: 77.6245,
      startingKm: 2000.0,
      endingKm: 2018.7,
      scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const createdBookings = [];
  for (const booking of bookings) {
    try {
      const result = await apiRequest('POST', '/bookings', booking);
      createdBookings.push(result);
      console.log(`✓ Created booking: ${booking.pickupAddress} → ${booking.dropAddress}`);
    } catch (error) {
      console.log(`✗ Failed to create booking`);
    }
  }
  return createdBookings;
}

// Main seed function
async function seed() {
  try {
    await login();
    
    const companies = await createCompanies();
    if (companies.length === 0) {
      console.log('\nNo companies created. Exiting...');
      return;
    }

    const companyId = companies[0].id;
    
    const passengers = await createPassengers(companyId);
    const vehicles = await createVehicles(companyId);
    const drivers = await createDrivers(companyId, vehicles);
    const bookings = await createBookings(companyId, passengers, drivers);

    console.log('\n✓ Seed data created successfully!');
    console.log(`  - Companies: ${companies.length}`);
    console.log(`  - Passengers: ${passengers.length}`);
    console.log(`  - Vehicles: ${vehicles.length}`);
    console.log(`  - Drivers: ${drivers.length}`);
    console.log(`  - Bookings: ${bookings.length}`);
  } catch (error) {
    console.error('\n✗ Seed failed:', error.message);
    process.exit(1);
  }
}

// Run seed
seed();

