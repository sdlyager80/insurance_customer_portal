export interface Provider {
  id: string;
  name: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  latitude: number;
  longitude: number;
  telemedicine: boolean;
  rating?: number;
  image?: string;
  distance?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SearchFilters {
  country: string;
  address: string;
  distance: number;
  specialty: string;
  doctorName: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  visitType: 'in-person' | 'telehealth';
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface BookingStep {
  step: number;
  title: string;
  completed: boolean;
}

export type ViewMode = 'list' | 'map';

export type CareOption = 'in-person' | 'telehealth' | 'emergency';

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
  };
}
