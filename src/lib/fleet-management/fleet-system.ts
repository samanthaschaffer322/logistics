/**
 * Advanced Fleet Management System
 * Integrated from Fleetbase and Logistics-App features
 */

export interface Vehicle {
  id: string
  plateNumber: string
  type: 'truck' | 'van' | 'container_truck' | 'car_carrier'
  make: string
  model: string
  year: number
  capacity: {
    weight: number // kg
    volume: number // m³
    containers?: number // for container trucks
    cars?: number // for car carriers
  }
  status: 'available' | 'in_transit' | 'maintenance' | 'offline'
  location: {
    lat: number
    lng: number
    address: string
    timestamp: Date
  }
  driver?: Driver
  fuel: {
    level: number // percentage
    consumption: number // km/l
    cost: number // VND per liter
  }
  maintenance: {
    lastService: Date
    nextService: Date
    mileage: number
    issues: MaintenanceIssue[]
  }
  documents: {
    registration: VehicleDocument
    insurance: VehicleDocument
    inspection: VehicleDocument
  }
  performance: {
    totalDistance: number
    totalTrips: number
    averageSpeed: number
    fuelEfficiency: number
    onTimeDelivery: number
  }
}

export interface Driver {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  licenseExpiry: Date
  status: 'available' | 'driving' | 'resting' | 'offline'
  location: {
    lat: number
    lng: number
    timestamp: Date
  }
  workingHours: {
    start: string
    end: string
    totalToday: number
    maxDaily: number
  }
  performance: {
    rating: number
    totalTrips: number
    safetyScore: number
    punctualityScore: number
  }
  documents: {
    license: VehicleDocument
    medicalCert: VehicleDocument
    trainingCert: VehicleDocument
  }
}

export interface VehicleDocument {
  id: string
  type: string
  number: string
  issueDate: Date
  expiryDate: Date
  status: 'valid' | 'expired' | 'expiring_soon'
  fileUrl?: string
}

export interface MaintenanceIssue {
  id: string
  type: 'engine' | 'brakes' | 'tires' | 'electrical' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  reportedDate: Date
  status: 'open' | 'in_progress' | 'resolved'
  cost?: number
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  origin: Location
  destination: Location
  waypoints: Location[]
  cargo: {
    type: string
    weight: number
    value: number
    specialRequirements?: string[]
  }
  schedule: {
    plannedStart: Date
    actualStart?: Date
    plannedEnd: Date
    actualEnd?: Date
    estimatedDuration: number
  }
  route: {
    distance: number
    duration: number
    fuelCost: number
    tollCost: number
    optimized: boolean
  }
  tracking: {
    currentLocation: Location
    progress: number // percentage
    eta: Date
    delays: Delay[]
  }
  documents: {
    manifest: string
    invoice: string
    deliveryReceipt?: string
  }
}

export interface Location {
  lat: number
  lng: number
  address: string
  contactPerson?: string
  contactPhone?: string
  instructions?: string
}

export interface Delay {
  id: string
  type: 'traffic' | 'weather' | 'mechanical' | 'loading' | 'other'
  duration: number // minutes
  reason: string
  timestamp: Date
}

export class FleetManagementSystem {
  private vehicles: Map<string, Vehicle> = new Map()
  private drivers: Map<string, Driver> = new Map()
  private trips: Map<string, Trip> = new Map()

  constructor() {
    this.initializeFleet()
  }

  /**
   * Initialize fleet with sample data
   */
  private initializeFleet() {
    // Sample vehicles
    const sampleVehicles: Vehicle[] = [
      {
        id: 'VH001',
        plateNumber: '29C-12345',
        type: 'container_truck',
        make: 'Hyundai',
        model: 'HD320',
        year: 2020,
        capacity: {
          weight: 30000,
          volume: 76,
          containers: 1
        },
        status: 'available',
        location: {
          lat: 10.8231,
          lng: 106.6297,
          address: 'Ho Chi Minh City Port',
          timestamp: new Date()
        },
        fuel: {
          level: 85,
          consumption: 3.5,
          cost: 25000
        },
        maintenance: {
          lastService: new Date('2024-07-15'),
          nextService: new Date('2024-10-15'),
          mileage: 45000,
          issues: []
        },
        documents: {
          registration: {
            id: 'REG001',
            type: 'registration',
            number: 'REG-29C-12345',
            issueDate: new Date('2020-01-15'),
            expiryDate: new Date('2025-01-15'),
            status: 'valid'
          },
          insurance: {
            id: 'INS001',
            type: 'insurance',
            number: 'INS-VH001-2024',
            issueDate: new Date('2024-01-01'),
            expiryDate: new Date('2024-12-31'),
            status: 'valid'
          },
          inspection: {
            id: 'INSP001',
            type: 'inspection',
            number: 'INSP-VH001-2024',
            issueDate: new Date('2024-06-01'),
            expiryDate: new Date('2024-12-01'),
            status: 'valid'
          }
        },
        performance: {
          totalDistance: 125000,
          totalTrips: 450,
          averageSpeed: 65,
          fuelEfficiency: 3.5,
          onTimeDelivery: 92
        }
      },
      {
        id: 'VH002',
        plateNumber: '30A-67890',
        type: 'truck',
        make: 'Isuzu',
        model: 'FVR',
        year: 2019,
        capacity: {
          weight: 15000,
          volume: 45
        },
        status: 'in_transit',
        location: {
          lat: 21.0285,
          lng: 105.8542,
          address: 'Hanoi Distribution Center',
          timestamp: new Date()
        },
        fuel: {
          level: 60,
          consumption: 4.2,
          cost: 25000
        },
        maintenance: {
          lastService: new Date('2024-06-20'),
          nextService: new Date('2024-09-20'),
          mileage: 78000,
          issues: [
            {
              id: 'ISS001',
              type: 'tires',
              severity: 'medium',
              description: 'Front tires showing wear, replacement needed soon',
              reportedDate: new Date('2024-07-30'),
              status: 'open'
            }
          ]
        },
        documents: {
          registration: {
            id: 'REG002',
            type: 'registration',
            number: 'REG-30A-67890',
            issueDate: new Date('2019-03-10'),
            expiryDate: new Date('2024-03-10'),
            status: 'expired'
          },
          insurance: {
            id: 'INS002',
            type: 'insurance',
            number: 'INS-VH002-2024',
            issueDate: new Date('2024-01-01'),
            expiryDate: new Date('2024-12-31'),
            status: 'valid'
          },
          inspection: {
            id: 'INSP002',
            type: 'inspection',
            number: 'INSP-VH002-2024',
            issueDate: new Date('2024-05-15'),
            expiryDate: new Date('2024-11-15'),
            status: 'valid'
          }
        },
        performance: {
          totalDistance: 156000,
          totalTrips: 620,
          averageSpeed: 58,
          fuelEfficiency: 4.2,
          onTimeDelivery: 88
        }
      }
    ]

    // Sample drivers
    const sampleDrivers: Driver[] = [
      {
        id: 'DR001',
        name: 'Nguyễn Văn Minh',
        phone: '+84901234567',
        email: 'minh.nguyen@logiai.com',
        licenseNumber: 'B2-123456789',
        licenseExpiry: new Date('2026-05-15'),
        status: 'available',
        location: {
          lat: 10.8231,
          lng: 106.6297,
          timestamp: new Date()
        },
        workingHours: {
          start: '06:00',
          end: '18:00',
          totalToday: 8,
          maxDaily: 12
        },
        performance: {
          rating: 4.8,
          totalTrips: 1250,
          safetyScore: 95,
          punctualityScore: 92
        },
        documents: {
          license: {
            id: 'LIC001',
            type: 'license',
            number: 'B2-123456789',
            issueDate: new Date('2020-05-15'),
            expiryDate: new Date('2026-05-15'),
            status: 'valid'
          },
          medicalCert: {
            id: 'MED001',
            type: 'medical',
            number: 'MED-DR001-2024',
            issueDate: new Date('2024-01-10'),
            expiryDate: new Date('2025-01-10'),
            status: 'valid'
          },
          trainingCert: {
            id: 'TRN001',
            type: 'training',
            number: 'TRN-DR001-2024',
            issueDate: new Date('2024-02-01'),
            expiryDate: new Date('2026-02-01'),
            status: 'valid'
          }
        }
      },
      {
        id: 'DR002',
        name: 'Trần Thị Lan',
        phone: '+84907654321',
        email: 'lan.tran@logiai.com',
        licenseNumber: 'C-987654321',
        licenseExpiry: new Date('2025-12-20'),
        status: 'driving',
        location: {
          lat: 16.0544,
          lng: 108.2022,
          timestamp: new Date()
        },
        workingHours: {
          start: '05:30',
          end: '17:30',
          totalToday: 10,
          maxDaily: 12
        },
        performance: {
          rating: 4.6,
          totalTrips: 890,
          safetyScore: 98,
          punctualityScore: 89
        },
        documents: {
          license: {
            id: 'LIC002',
            type: 'license',
            number: 'C-987654321',
            issueDate: new Date('2019-12-20'),
            expiryDate: new Date('2025-12-20'),
            status: 'expiring_soon'
          },
          medicalCert: {
            id: 'MED002',
            type: 'medical',
            number: 'MED-DR002-2024',
            issueDate: new Date('2024-03-15'),
            expiryDate: new Date('2025-03-15'),
            status: 'valid'
          },
          trainingCert: {
            id: 'TRN002',
            type: 'training',
            number: 'TRN-DR002-2023',
            issueDate: new Date('2023-11-10'),
            expiryDate: new Date('2025-11-10'),
            status: 'valid'
          }
        }
      }
    ]

    // Initialize data
    sampleVehicles.forEach(vehicle => this.vehicles.set(vehicle.id, vehicle))
    sampleDrivers.forEach(driver => this.drivers.set(driver.id, driver))
  }

  /**
   * Get all vehicles
   */
  getVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values())
  }

  /**
   * Get vehicle by ID
   */
  getVehicle(id: string): Vehicle | undefined {
    return this.vehicles.get(id)
  }

  /**
   * Get available vehicles
   */
  getAvailableVehicles(): Vehicle[] {
    return this.getVehicles().filter(v => v.status === 'available')
  }

  /**
   * Get vehicles by type
   */
  getVehiclesByType(type: Vehicle['type']): Vehicle[] {
    return this.getVehicles().filter(v => v.type === type)
  }

  /**
   * Get all drivers
   */
  getDrivers(): Driver[] {
    return Array.from(this.drivers.values())
  }

  /**
   * Get driver by ID
   */
  getDriver(id: string): Driver | undefined {
    return this.drivers.get(id)
  }

  /**
   * Get available drivers
   */
  getAvailableDrivers(): Driver[] {
    return this.getDrivers().filter(d => d.status === 'available')
  }

  /**
   * Get fleet statistics
   */
  getFleetStats() {
    const vehicles = this.getVehicles()
    const drivers = this.getDrivers()

    return {
      vehicles: {
        total: vehicles.length,
        available: vehicles.filter(v => v.status === 'available').length,
        inTransit: vehicles.filter(v => v.status === 'in_transit').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length,
        offline: vehicles.filter(v => v.status === 'offline').length
      },
      drivers: {
        total: drivers.length,
        available: drivers.filter(d => d.status === 'available').length,
        driving: drivers.filter(d => d.status === 'driving').length,
        resting: drivers.filter(d => d.status === 'resting').length,
        offline: drivers.filter(d => d.status === 'offline').length
      },
      performance: {
        averageRating: drivers.reduce((sum, d) => sum + d.performance.rating, 0) / drivers.length,
        totalTrips: vehicles.reduce((sum, v) => sum + v.performance.totalTrips, 0),
        averageOnTime: vehicles.reduce((sum, v) => sum + v.performance.onTimeDelivery, 0) / vehicles.length,
        totalDistance: vehicles.reduce((sum, v) => sum + v.performance.totalDistance, 0)
      },
      maintenance: {
        upcomingServices: vehicles.filter(v => {
          const daysUntilService = Math.ceil((v.maintenance.nextService.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          return daysUntilService <= 30
        }).length,
        openIssues: vehicles.reduce((sum, v) => sum + v.maintenance.issues.filter(i => i.status === 'open').length, 0),
        criticalIssues: vehicles.reduce((sum, v) => sum + v.maintenance.issues.filter(i => i.severity === 'critical').length, 0)
      },
      documents: {
        expiring: [...vehicles, ...drivers].reduce((count, entity) => {
          const docs = 'documents' in entity ? Object.values(entity.documents) : []
          return count + docs.filter(doc => doc.status === 'expiring_soon' || doc.status === 'expired').length
        }, 0)
      }
    }
  }

  /**
   * Update vehicle location (for real-time tracking)
   */
  updateVehicleLocation(vehicleId: string, location: { lat: number, lng: number, address: string }) {
    const vehicle = this.vehicles.get(vehicleId)
    if (vehicle) {
      vehicle.location = {
        ...location,
        timestamp: new Date()
      }
      this.vehicles.set(vehicleId, vehicle)
    }
  }

  /**
   * Update driver location (for real-time tracking)
   */
  updateDriverLocation(driverId: string, location: { lat: number, lng: number }) {
    const driver = this.drivers.get(driverId)
    if (driver) {
      driver.location = {
        ...location,
        timestamp: new Date()
      }
      this.drivers.set(driverId, driver)
    }
  }

  /**
   * Assign driver to vehicle
   */
  assignDriverToVehicle(driverId: string, vehicleId: string): boolean {
    const driver = this.drivers.get(driverId)
    const vehicle = this.vehicles.get(vehicleId)

    if (driver && vehicle && driver.status === 'available' && vehicle.status === 'available') {
      vehicle.driver = driver
      driver.status = 'driving'
      vehicle.status = 'in_transit'
      
      this.vehicles.set(vehicleId, vehicle)
      this.drivers.set(driverId, driver)
      
      return true
    }
    
    return false
  }

  /**
   * Create maintenance issue
   */
  createMaintenanceIssue(vehicleId: string, issue: Omit<MaintenanceIssue, 'id'>): boolean {
    const vehicle = this.vehicles.get(vehicleId)
    if (vehicle) {
      const newIssue: MaintenanceIssue = {
        ...issue,
        id: `ISS${Date.now()}`
      }
      
      vehicle.maintenance.issues.push(newIssue)
      
      // Set vehicle to maintenance if critical issue
      if (issue.severity === 'critical') {
        vehicle.status = 'maintenance'
      }
      
      this.vehicles.set(vehicleId, vehicle)
      return true
    }
    
    return false
  }

  /**
   * Get vehicles needing maintenance
   */
  getVehiclesNeedingMaintenance(): Vehicle[] {
    const now = new Date()
    return this.getVehicles().filter(vehicle => {
      const daysUntilService = Math.ceil((vehicle.maintenance.nextService.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const hasCriticalIssues = vehicle.maintenance.issues.some(issue => issue.severity === 'critical' && issue.status === 'open')
      
      return daysUntilService <= 7 || hasCriticalIssues
    })
  }

  /**
   * Get expiring documents
   */
  getExpiringDocuments(): Array<{ entity: Vehicle | Driver, document: VehicleDocument, type: 'vehicle' | 'driver' }> {
    const expiringDocs: Array<{ entity: Vehicle | Driver, document: VehicleDocument, type: 'vehicle' | 'driver' }> = []
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    // Check vehicle documents
    this.getVehicles().forEach(vehicle => {
      Object.values(vehicle.documents).forEach(doc => {
        if (doc.expiryDate <= thirtyDaysFromNow) {
          expiringDocs.push({ entity: vehicle, document: doc, type: 'vehicle' })
        }
      })
    })

    // Check driver documents
    this.getDrivers().forEach(driver => {
      Object.values(driver.documents).forEach(doc => {
        if (doc.expiryDate <= thirtyDaysFromNow) {
          expiringDocs.push({ entity: driver, document: doc, type: 'driver' })
        }
      })
    })

    return expiringDocs.sort((a, b) => a.document.expiryDate.getTime() - b.document.expiryDate.getTime())
  }
}
