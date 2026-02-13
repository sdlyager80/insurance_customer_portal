import type { Provider, Location, SearchFilters, Appointment } from '../types/provider';

// Mock provider data covering multiple countries and specialties
const mockProviders: Provider[] = [
  // United States Providers
  {
    id: 'p1',
    name: 'Dr. Sarah Johnson',
    specialty: 'General Practice',
    address: '123 Medical Center Dr',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    phone: '+1 (212) 555-0100',
    latitude: 40.7589,
    longitude: -73.9851,
    telemedicine: true,
    rating: 4.8,
  },
  {
    id: 'p2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    address: '456 Heart Health Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'United States',
    phone: '+1 (323) 555-0200',
    latitude: 34.0522,
    longitude: -118.2437,
    telemedicine: true,
    rating: 4.9,
  },
  {
    id: 'p3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    address: '789 Children\'s Way',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    country: 'United States',
    phone: '+1 (312) 555-0300',
    latitude: 41.8781,
    longitude: -87.6298,
    telemedicine: false,
    rating: 4.7,
  },
  {
    id: 'p4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    address: '321 Bone & Joint Blvd',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    country: 'United States',
    phone: '+1 (713) 555-0400',
    latitude: 29.7604,
    longitude: -95.3698,
    telemedicine: false,
    rating: 4.6,
  },
  {
    id: 'p5',
    name: 'Dr. Lisa Anderson',
    specialty: 'Dermatology',
    address: '555 Skin Care Plaza',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    country: 'United States',
    phone: '+1 (305) 555-0500',
    latitude: 25.7617,
    longitude: -80.1918,
    telemedicine: true,
    rating: 4.8,
  },

  // United Kingdom Providers
  {
    id: 'p6',
    name: 'Dr. Oliver Thompson',
    specialty: 'General Practice',
    address: '10 Harley Street',
    city: 'London',
    state: 'England',
    zip: 'W1G 9PF',
    country: 'United Kingdom',
    phone: '+44 20 7123 4567',
    latitude: 51.5074,
    longitude: -0.1278,
    telemedicine: true,
    rating: 4.7,
  },
  {
    id: 'p7',
    name: 'Dr. Emma Davies',
    specialty: 'Cardiology',
    address: '25 Queen Square',
    city: 'Bristol',
    state: 'England',
    zip: 'BS1 4QS',
    country: 'United Kingdom',
    phone: '+44 117 555 0100',
    latitude: 51.4545,
    longitude: -2.5879,
    telemedicine: true,
    rating: 4.9,
  },
  {
    id: 'p8',
    name: 'Dr. William MacLeod',
    specialty: 'Orthopedics',
    address: '15 Royal Infirmary St',
    city: 'Edinburgh',
    state: 'Scotland',
    zip: 'EH1 1YT',
    country: 'United Kingdom',
    phone: '+44 131 555 0200',
    latitude: 55.9533,
    longitude: -3.1883,
    telemedicine: false,
    rating: 4.6,
  },

  // Canada Providers
  {
    id: 'p9',
    name: 'Dr. Sophie Tremblay',
    specialty: 'General Practice',
    address: '200 University Ave',
    city: 'Toronto',
    state: 'ON',
    zip: 'M5H 3C6',
    country: 'Canada',
    phone: '+1 (416) 555-0100',
    latitude: 43.6532,
    longitude: -79.3832,
    telemedicine: true,
    rating: 4.8,
  },
  {
    id: 'p10',
    name: 'Dr. David Kumar',
    specialty: 'Pediatrics',
    address: '1050 West 8th Ave',
    city: 'Vancouver',
    state: 'BC',
    zip: 'V6H 1C5',
    country: 'Canada',
    phone: '+1 (604) 555-0200',
    latitude: 49.2827,
    longitude: -123.1207,
    telemedicine: true,
    rating: 4.7,
  },

  // Australia Providers
  {
    id: 'p11',
    name: 'Dr. Rachel Foster',
    specialty: 'Dermatology',
    address: '88 Macquarie Street',
    city: 'Sydney',
    state: 'NSW',
    zip: '2000',
    country: 'Australia',
    phone: '+61 2 9123 4567',
    latitude: -33.8688,
    longitude: 151.2093,
    telemedicine: true,
    rating: 4.9,
  },
  {
    id: 'p12',
    name: 'Dr. Mark Patterson',
    specialty: 'Cardiology',
    address: '123 Collins Street',
    city: 'Melbourne',
    state: 'VIC',
    zip: '3000',
    country: 'Australia',
    phone: '+61 3 9555 0100',
    latitude: -37.8136,
    longitude: 144.9631,
    telemedicine: false,
    rating: 4.8,
  },

  // Germany Providers
  {
    id: 'p13',
    name: 'Dr. Hans Müller',
    specialty: 'Orthopedics',
    address: 'Friedrichstraße 123',
    city: 'Berlin',
    state: 'Berlin',
    zip: '10117',
    country: 'Germany',
    phone: '+49 30 1234 5678',
    latitude: 52.5200,
    longitude: 13.4050,
    telemedicine: true,
    rating: 4.7,
  },
  {
    id: 'p14',
    name: 'Dr. Anna Schmidt',
    specialty: 'General Practice',
    address: 'Marienplatz 15',
    city: 'Munich',
    state: 'Bavaria',
    zip: '80331',
    country: 'Germany',
    phone: '+49 89 5555 0100',
    latitude: 48.1351,
    longitude: 11.5820,
    telemedicine: true,
    rating: 4.6,
  },

  // France Providers
  {
    id: 'p15',
    name: 'Dr. Marie Dubois',
    specialty: 'Pediatrics',
    address: '15 Avenue des Champs-Élysées',
    city: 'Paris',
    state: 'Île-de-France',
    zip: '75008',
    country: 'France',
    phone: '+33 1 4567 8900',
    latitude: 48.8566,
    longitude: 2.3522,
    telemedicine: true,
    rating: 4.9,
  },

  // India Providers (Pune - Baner Area)
  {
    id: 'p16',
    name: 'Dr. Priya Sharma',
    specialty: 'General Practice',
    address: 'Baner Road, Aundh-Baner Link Road',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411045',
    country: 'India',
    phone: '+91 20 2567 8900',
    latitude: 18.5596,
    longitude: 73.7789,
    telemedicine: true,
    rating: 4.8,
  },
  {
    id: 'p17',
    name: 'Dr. Rajesh Patel',
    specialty: 'Cardiology',
    address: 'Balewadi High Street, Near Baner',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411045',
    country: 'India',
    phone: '+91 20 2567 8901',
    latitude: 18.5642,
    longitude: 73.7678,
    telemedicine: true,
    rating: 4.7,
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export const providerService = {
  /**
   * Get all providers
   */
  getAllProviders(): Provider[] {
    return [...mockProviders];
  },

  /**
   * Get provider by ID
   */
  getProviderById(id: string): Provider | undefined {
    return mockProviders.find((p) => p.id === id);
  },

  /**
   * Search providers with filters
   */
  searchProviders(
    filters: SearchFilters,
    userLocation?: Location
  ): Provider[] {
    let results = [...mockProviders];

    // Filter by country
    if (filters.country && filters.country !== 'all') {
      results = results.filter((p) => p.country === filters.country);
    }

    // Filter by specialty
    if (filters.specialty && filters.specialty !== 'all') {
      results = results.filter((p) => p.specialty === filters.specialty);
    }

    // Filter by doctor name
    if (filters.doctorName) {
      const searchTerm = filters.doctorName.toLowerCase();
      results = results.filter((p) =>
        p.name.toLowerCase().includes(searchTerm)
      );
    }

    // Calculate distances if user location is provided
    if (userLocation) {
      results = results.map((provider) => ({
        ...provider,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          provider.latitude,
          provider.longitude
        ),
      }));

      // Filter by distance
      if (filters.distance && filters.distance > 0) {
        results = results.filter(
          (p) => p.distance !== undefined && p.distance <= filters.distance
        );
      }

      // Sort by distance
      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return results;
  },

  /**
   * Get unique countries from providers
   */
  getCountries(): string[] {
    const countries = new Set(mockProviders.map((p) => p.country));
    return Array.from(countries).sort();
  },

  /**
   * Get unique specialties from providers
   */
  getSpecialties(): string[] {
    const specialties = new Set(mockProviders.map((p) => p.specialty));
    return Array.from(specialties).sort();
  },

  /**
   * Get available time slots for a specific date
   */
  getAvailableTimeSlots(_providerId: string, _date: string): string[] {
    // Mock time slots - in real app, this would query availability
    return [
      '09:00 AM',
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
      '02:00 PM',
      '02:30 PM',
      '03:00 PM',
      '03:30 PM',
      '04:00 PM',
      '04:30 PM',
    ];
  },

  /**
   * Get visit reasons
   */
  getVisitReasons(): string[] {
    return [
      'Annual Checkup',
      'Follow-up Visit',
      'New Symptoms',
      'Prescription Refill',
      'Consultation',
      'Emergency',
      'Second Opinion',
      'Other',
    ];
  },

  /**
   * Generate confirmation number
   */
  generateConfirmationNumber(): string {
    const prefix = 'BLM';
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${random}`;
  },

  /**
   * Book an appointment (mock)
   */
  async bookAppointment(
    providerId: string,
    date: string,
    time: string,
    reason: string,
    visitType: 'in-person' | 'telehealth'
  ): Promise<Appointment> {
    const provider = this.getProviderById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      providerId,
      providerName: provider.name,
      date,
      time,
      reason,
      visitType,
      confirmationNumber: this.generateConfirmationNumber(),
      status: 'confirmed',
    };

    // Save to localStorage
    this.saveAppointment(appointment);

    return appointment;
  },

  /**
   * Save appointment to localStorage
   */
  saveAppointment(appointment: Appointment): void {
    const appointments = this.getAllAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  },

  /**
   * Get all appointments from localStorage
   */
  getAllAppointments(): Appointment[] {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Get appointment by ID
   */
  getAppointmentById(id: string): Appointment | undefined {
    const appointments = this.getAllAppointments();
    return appointments.find((apt) => apt.id === id);
  },

  /**
   * Get appointment by confirmation number
   */
  getAppointmentByConfirmation(confirmationNumber: string): Appointment | undefined {
    const appointments = this.getAllAppointments();
    return appointments.find((apt) => apt.confirmationNumber === confirmationNumber);
  },

  /**
   * Cancel appointment
   */
  cancelAppointment(id: string): boolean {
    const appointments = this.getAllAppointments();
    const index = appointments.findIndex((apt) => apt.id === id);
    if (index === -1) return false;

    appointments[index].status = 'cancelled';
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return true;
  },

  /**
   * Get upcoming appointments (not cancelled, future dates)
   */
  getUpcomingAppointments(): Appointment[] {
    const appointments = this.getAllAppointments();
    const now = new Date();
    return appointments
      .filter((apt) => {
        if (apt.status === 'cancelled') return false;
        const aptDate = new Date(apt.date);
        return aptDate >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  /**
   * Get past appointments
   */
  getPastAppointments(): Appointment[] {
    const appointments = this.getAllAppointments();
    const now = new Date();
    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate < now;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
};
