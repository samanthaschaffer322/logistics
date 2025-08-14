import axios from 'axios';

const ORS_BASE_URL = 'https://api.openrouteservice.org';

interface ORSLocation {
  lat: number;
  lng: number;
}

interface ORSDirectionsOptions {
  profile?: 'driving-car' | 'driving-hgv' | 'cycling-road' | 'cycling-mountain' | 'cycling-regular' | 'walking' | 'foot-walking' | 'foot-hiking' | 'wheelchair';
  preference?: 'fastest' | 'shortest';
  units?: 'km' | 'm';
  language?: 'en' | 'vi';
  // Add more options as needed, e.g., avoiding tolls, ferries, etc.
  // For truck-specific: weight, height, width, length, hazardous_materials, etc.
  // See ORS API docs for full list: https://openrouteservice.org/dev/#/api-docs/v2/directions/{profile}/geojson/post
  options?: {
    avoid_features?: string[]; // e.g., ['tollways', 'ferries']
    vehicle_type?: 'car' | 'hgv';
    profile_params?: {
      weight?: number; // in tons
      height?: number; // in meters
      width?: number; // in meters
      length?: number; // in meters
      hazardous_materials?: boolean;
    };
  };
}

interface ORSDirectionsResponse {
  routes: Array<{
    summary: {
      distance: number; // in meters
      duration: number; // in seconds
    };
    geometry: any; // GeoJSON LineString
    segments: any[];
  }>;
  metadata: any;
}

interface ORSGeocodeResponse {
  features: Array<{
    geometry: {
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
      label: string;
      name: string;
      country: string;
      region: string;
      county: string;
      locality: string;
      confidence: number;
    };
  }>;
}

export class ORSIntegration {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenRouteService API key is required.');
    }
    this.apiKey = apiKey;
  }

  /**
   * Calculates directions between two or more points.
   * @param coordinates Array of [longitude, latitude] pairs.
   * @param options ORS directions options.
   */
  public async getDirections(
    coordinates: [number, number][],
    options: ORSDirectionsOptions = {}
  ): Promise<ORSDirectionsResponse> {
    const profile = options.profile || 'driving-car';
    const url = `${ORS_BASE_URL}/v2/directions/${profile}/geojson`;

    try {
      const response = await axios.post(url, {
        coordinates: coordinates,
        ...options,
      }, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ORS directions:', error.response?.data || error.message);
      throw new Error(`Failed to get ORS directions: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Geocodes an address string to coordinates.
   * @param address The address string to geocode.
   * @param language Language for the results (e.g., 'en', 'vi').
   */
  public async geocode(address: string, language: 'en' | 'vi' = 'en'): Promise<ORSGeocodeResponse> {
    const url = `${ORS_BASE_URL}/geocode/search`;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: this.apiKey,
          text: address,
          lang: language,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ORS geocode:', error.response?.data || error.message);
      throw new Error(`Failed to geocode address: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Reverse geocodes coordinates to an address.
   * @param lat Latitude.
   * @param lng Longitude.
   * @param language Language for the results (e.g., 'en', 'vi').
   */
  public async reverseGeocode(lat: number, lng: number, language: 'en' | 'vi' = 'en'): Promise<ORSGeocodeResponse> {
    const url = `${ORS_BASE_URL}/geocode/reverse`;
    try {
      const response = await axios.get(url, {
        params: {
          api_key: this.apiKey,
          point: `${lng},${lat}`, // ORS expects [longitude, latitude]
          lang: language,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ORS reverse geocode:', error.response?.data || error.message);
      throw new Error(`Failed to reverse geocode: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // You can add more methods here for matrix, isochrones, etc.
}
