import axios, { AxiosInstance } from 'axios';

// Fleetbase Integration Service
export interface FleetbaseConfig {
  apiUrl: string;
  apiKey: string;
  organizationId?: string;
  environment?: 'development' | 'production';
}

export interface FleetbaseOrder {
  id?: string;
  public_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  pickup_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  scheduled_at?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  type?: 'delivery' | 'pickup' | 'return';
  status?: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  meta?: Record<string, any>;
  items?: FleetbaseOrderItem[];
}

export interface FleetbaseOrderItem {
  name: string;
  quantity: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  value?: number;
  sku?: string;
}

export interface FleetbaseDriver {
  id?: string;
  public_id?: string;
  name: string;
  email?: string;
  phone: string;
  vehicle_id?: string;
  status?: 'active' | 'inactive' | 'busy';
  location?: {
    lat: number;
    lng: number;
    updated_at: string;
  };
  rating?: number;
}

export interface FleetbaseVehicle {
  id?: string;
  public_id?: string;
  name: string;
  plate_number: string;
  type: 'car' | 'van' | 'truck' | 'motorcycle' | 'bicycle';
  capacity_weight?: number;
  capacity_volume?: number;
  fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  status?: 'active' | 'inactive' | 'maintenance';
  driver_id?: string;
}

export interface FleetbaseRoute {
  id?: string;
  public_id?: string;
  name: string;
  driver_id: string;
  vehicle_id: string;
  orders: string[]; // Order IDs
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  distance?: number;
  duration?: number;
  waypoints?: Array<{
    lat: number;
    lng: number;
    order_id?: string;
    type: 'pickup' | 'delivery' | 'waypoint';
  }>;
}

export interface FleetbaseTracking {
  order_id: string;
  driver_id?: string;
  vehicle_id?: string;
  status: string;
  location?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  eta?: string;
  distance_remaining?: number;
  events: FleetbaseTrackingEvent[];
}

export interface FleetbaseTrackingEvent {
  type: 'created' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'exception';
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
  };
  message?: string;
  meta?: Record<string, any>;
}

export class FleetbaseIntegration {
  private client: AxiosInstance;
  private config: FleetbaseConfig;

  constructor(config: FleetbaseConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('Fleetbase API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Order Management
  async createOrder(order: FleetbaseOrder): Promise<FleetbaseOrder> {
    try {
      const response = await this.client.post('/orders', {
        order: {
          ...order,
          organization_id: this.config.organizationId
        }
      });
      return response.data.order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async getOrder(orderId: string): Promise<FleetbaseOrder> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  async updateOrder(orderId: string, updates: Partial<FleetbaseOrder>): Promise<FleetbaseOrder> {
    try {
      const response = await this.client.put(`/orders/${orderId}`, {
        order: updates
      });
      return response.data.order;
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<FleetbaseOrder> {
    try {
      const response = await this.client.post(`/orders/${orderId}/cancel`, {
        reason
      });
      return response.data.order;
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  async getOrders(filters?: {
    status?: string;
    driver_id?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetbaseOrder[]> {
    try {
      const response = await this.client.get('/orders', { params: filters });
      return response.data.orders || [];
    } catch (error) {
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  // Driver Management
  async createDriver(driver: FleetbaseDriver): Promise<FleetbaseDriver> {
    try {
      const response = await this.client.post('/drivers', {
        driver: {
          ...driver,
          organization_id: this.config.organizationId
        }
      });
      return response.data.driver;
    } catch (error) {
      throw new Error(`Failed to create driver: ${error.message}`);
    }
  }

  async getDriver(driverId: string): Promise<FleetbaseDriver> {
    try {
      const response = await this.client.get(`/drivers/${driverId}`);
      return response.data.driver;
    } catch (error) {
      throw new Error(`Failed to get driver: ${error.message}`);
    }
  }

  async updateDriver(driverId: string, updates: Partial<FleetbaseDriver>): Promise<FleetbaseDriver> {
    try {
      const response = await this.client.put(`/drivers/${driverId}`, {
        driver: updates
      });
      return response.data.driver;
    } catch (error) {
      throw new Error(`Failed to update driver: ${error.message}`);
    }
  }

  async getDrivers(filters?: {
    status?: string;
    vehicle_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetbaseDriver[]> {
    try {
      const response = await this.client.get('/drivers', { params: filters });
      return response.data.drivers || [];
    } catch (error) {
      throw new Error(`Failed to get drivers: ${error.message}`);
    }
  }

  async getDriverLocation(driverId: string): Promise<{ lat: number; lng: number; updated_at: string }> {
    try {
      const response = await this.client.get(`/drivers/${driverId}/location`);
      return response.data.location;
    } catch (error) {
      throw new Error(`Failed to get driver location: ${error.message}`);
    }
  }

  // Vehicle Management
  async createVehicle(vehicle: FleetbaseVehicle): Promise<FleetbaseVehicle> {
    try {
      const response = await this.client.post('/vehicles', {
        vehicle: {
          ...vehicle,
          organization_id: this.config.organizationId
        }
      });
      return response.data.vehicle;
    } catch (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
  }

  async getVehicle(vehicleId: string): Promise<FleetbaseVehicle> {
    try {
      const response = await this.client.get(`/vehicles/${vehicleId}`);
      return response.data.vehicle;
    } catch (error) {
      throw new Error(`Failed to get vehicle: ${error.message}`);
    }
  }

  async updateVehicle(vehicleId: string, updates: Partial<FleetbaseVehicle>): Promise<FleetbaseVehicle> {
    try {
      const response = await this.client.put(`/vehicles/${vehicleId}`, {
        vehicle: updates
      });
      return response.data.vehicle;
    } catch (error) {
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }
  }

  async getVehicles(filters?: {
    status?: string;
    type?: string;
    driver_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<FleetbaseVehicle[]> {
    try {
      const response = await this.client.get('/vehicles', { params: filters });
      return response.data.vehicles || [];
    } catch (error) {
      throw new Error(`Failed to get vehicles: ${error.message}`);
    }
  }

  // Route Management
  async createRoute(route: Omit<FleetbaseRoute, 'id' | 'public_id'>): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.post('/routes', {
        route: {
          ...route,
          organization_id: this.config.organizationId
        }
      });
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to create route: ${error.message}`);
    }
  }

  async getRoute(routeId: string): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.get(`/routes/${routeId}`);
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to get route: ${error.message}`);
    }
  }

  async updateRoute(routeId: string, updates: Partial<FleetbaseRoute>): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.put(`/routes/${routeId}`, {
        route: updates
      });
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to update route: ${error.message}`);
    }
  }

  async optimizeRoute(routeId: string, options?: {
    algorithm?: 'genetic' | 'simulated_annealing' | 'ant_colony';
    optimize_for?: 'distance' | 'time' | 'cost';
  }): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.post(`/routes/${routeId}/optimize`, options);
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to optimize route: ${error.message}`);
    }
  }

  async startRoute(routeId: string): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.post(`/routes/${routeId}/start`);
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to start route: ${error.message}`);
    }
  }

  async completeRoute(routeId: string): Promise<FleetbaseRoute> {
    try {
      const response = await this.client.post(`/routes/${routeId}/complete`);
      return response.data.route;
    } catch (error) {
      throw new Error(`Failed to complete route: ${error.message}`);
    }
  }

  // Tracking and Real-time Updates
  async trackOrder(orderId: string): Promise<FleetbaseTracking> {
    try {
      const response = await this.client.get(`/orders/${orderId}/track`);
      return response.data.tracking;
    } catch (error) {
      throw new Error(`Failed to track order: ${error.message}`);
    }
  }

  async getOrderETA(orderId: string): Promise<{ eta: string; distance_remaining: number }> {
    try {
      const response = await this.client.get(`/orders/${orderId}/eta`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get order ETA: ${error.message}`);
    }
  }

  async updateOrderLocation(orderId: string, location: { lat: number; lng: number }): Promise<void> {
    try {
      await this.client.post(`/orders/${orderId}/location`, { location });
    } catch (error) {
      throw new Error(`Failed to update order location: ${error.message}`);
    }
  }

  // Analytics and Reporting
  async getAnalytics(params: {
    date_from: string;
    date_to: string;
    metrics?: string[];
    group_by?: 'day' | 'week' | 'month';
  }): Promise<any> {
    try {
      const response = await this.client.get('/analytics', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  async getPerformanceMetrics(driverId?: string, vehicleId?: string): Promise<{
    total_deliveries: number;
    success_rate: number;
    average_delivery_time: number;
    total_distance: number;
    fuel_efficiency?: number;
    customer_rating?: number;
  }> {
    try {
      const params: any = {};
      if (driverId) params.driver_id = driverId;
      if (vehicleId) params.vehicle_id = vehicleId;
      
      const response = await this.client.get('/performance', { params });
      return response.data.metrics;
    } catch (error) {
      throw new Error(`Failed to get performance metrics: ${error.message}`);
    }
  }

  // Webhook Management
  async createWebhook(webhook: {
    url: string;
    events: string[];
    secret?: string;
  }): Promise<{ id: string; url: string; events: string[] }> {
    try {
      const response = await this.client.post('/webhooks', { webhook });
      return response.data.webhook;
    } catch (error) {
      throw new Error(`Failed to create webhook: ${error.message}`);
    }
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    try {
      await this.client.delete(`/webhooks/${webhookId}`);
    } catch (error) {
      throw new Error(`Failed to delete webhook: ${error.message}`);
    }
  }

  // Utility Methods
  async geocodeAddress(address: string): Promise<{ lat: number; lng: number; formatted_address: string }> {
    try {
      const response = await this.client.post('/geocode', { address });
      return response.data.location;
    } catch (error) {
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  async calculateDistance(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): Promise<{ distance: number; duration: number; polyline?: string }> {
    try {
      const response = await this.client.post('/distance', { from, to });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to calculate distance: ${error.message}`);
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.client.get('/auth/validate');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Batch Operations
  async createBulkOrders(orders: FleetbaseOrder[]): Promise<{
    success: FleetbaseOrder[];
    failed: Array<{ order: FleetbaseOrder; error: string }>;
  }> {
    try {
      const response = await this.client.post('/orders/bulk', { orders });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create bulk orders: ${error.message}`);
    }
  }

  async assignBulkOrders(assignments: Array<{
    order_id: string;
    driver_id: string;
    vehicle_id?: string;
  }>): Promise<{
    success: string[];
    failed: Array<{ order_id: string; error: string }>;
  }> {
    try {
      const response = await this.client.post('/orders/assign-bulk', { assignments });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to assign bulk orders: ${error.message}`);
    }
  }

  // Real-time Socket Connection (if using Socket.IO)
  connectToRealTimeUpdates(callbacks: {
    onOrderUpdate?: (order: FleetbaseOrder) => void;
    onDriverLocationUpdate?: (driverId: string, location: { lat: number; lng: number }) => void;
    onRouteUpdate?: (route: FleetbaseRoute) => void;
  }): void {
    // This would typically use Socket.IO or WebSocket connection
    // Implementation depends on Fleetbase's real-time API
    console.log('Real-time updates would be connected here', callbacks);
  }
}

export default FleetbaseIntegration;
