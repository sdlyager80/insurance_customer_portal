import type { GeocodingResult, Location } from '../types/provider';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const geocodingService = {
  /**
   * Search for a location by address
   */
  async searchAddress(query: string): Promise<GeocodingResult[]> {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
        {
          headers: {
            'User-Agent': 'BloomInsurancePortal/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        address: item.address || {}
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  },

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'BloomInsurancePortal/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding request failed');
      }

      const data = await response.json();
      return data.display_name || `${latitude}, ${longitude}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${latitude}, ${longitude}`;
    }
  },

  /**
   * Get user's current location using browser geolocation API
   */
  async getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await this.reverseGeocode(latitude, longitude);
          resolve({
            latitude,
            longitude,
            address
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        {
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
};
