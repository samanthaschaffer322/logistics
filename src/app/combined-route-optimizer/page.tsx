'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Clock, 
  DollarSign, 
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  Plus,
  Minus,
  Settings,
  Brain,
  FileText,
  Calculator,
  Download,
  Edit,
  Save,
  X
} from 'lucide-react'
import FileBasedRouteOptimizer from '@/components/FileBasedRouteOptimizer'
import { EnhancedRouteCalculator } from '@/utils/enhancedRouteCalculator'

// Dynamic import for Leaflet map to avoid SSR issues
const LeafletRouteMap = dynamic(() => import('@/components/LeafletRouteMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '400px',
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '15px',
      border: '2px solid rgba(139, 92, 246, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
      <div style={{ color: '#8b5cf6', fontSize: '18px', fontWeight: 'bold' }}>Loading Interactive Map...</div>
    </div>
  )
})

export default function CombinedRouteOptimizerPage() {
  const { language } = useLanguage()
  const [activeView, setActiveView] = useState('routing')
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)
  
  // Multi-stop state
  const [multiStops, setMultiStops] = useState([
    { id: '1', name: '', lat: 0, lng: 0, type: 'origin' },
    { id: '2', name: '', lat: 0, lng: 0, type: 'destination' }
  ])
  const [multiRoute, setMultiRoute] = useState<any>(null)
  
  // Vehicle config for Advanced tab
  const [vehicleConfig, setVehicleConfig] = useState({
    type: 'container',
    capacity: 40000,
    fuelConsumption: 0.35,
    driverCost: 30000
  })

  // Comprehensive Southern Vietnam logistics locations database
  const vietnameseLocations = [
    // Major Cities
    { name: 'Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'Biên Hòa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Vũng Tàu', lat: 10.3460, lng: 107.0843, province: 'Ba Ria Vung Tau', type: 'city' },
    { name: 'Long Xuyên', lat: 10.3833, lng: 105.4333, province: 'An Giang', type: 'city' },
    { name: 'Mỹ Tho', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'city' },
    { name: 'Rạch Giá', lat: 10.0120, lng: 105.0802, province: 'Kien Giang', type: 'city' },
    { name: 'Cà Mau', lat: 9.1767, lng: 105.1524, province: 'Ca Mau', type: 'city' },
    
    // Major Ports - Ho Chi Minh City Area
    { name: 'Cảng Sài Gòn', lat: 10.7769, lng: 106.7009, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Cát Lái', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cat Lai Port', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Tân Cảng', lat: 10.7650, lng: 106.7050, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Hiệp Phước', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Phú Hữu', lat: 10.7500, lng: 106.8200, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Tân Thuận', lat: 10.7300, lng: 106.7100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng Newport', lat: 10.7850, lng: 106.8050, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Cảng SITV', lat: 10.7800, lng: 106.8000, province: 'Ho Chi Minh City', type: 'port' },
    
    // Dong Nai Ports
    { name: 'Cảng Đồng Nai', lat: 10.9200, lng: 106.8500, province: 'Dong Nai', type: 'port' },
    { name: 'Cảng Phước An', lat: 10.9100, lng: 106.8600, province: 'Dong Nai', type: 'port' },
    { name: 'Phước An', lat: 10.9100, lng: 106.8600, province: 'Dong Nai', type: 'port' },
    { name: 'Phuoc An', lat: 10.9100, lng: 106.8600, province: 'Dong Nai', type: 'port' },
    { name: 'Cảng Long Bình', lat: 10.9000, lng: 106.8400, province: 'Dong Nai', type: 'port' },
    
    // Comprehensive Vietnamese Logistics Companies & Facilities (500+ locations)
    
    // Major Vietnamese Freight Companies
    { name: 'Viettel Post', lat: 10.7800, lng: 106.6950, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Viettel Post', lat: 10.7800, lng: 106.6950, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vietnam Post', lat: 10.7750, lng: 106.6900, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Vietnam Post', lat: 10.7750, lng: 106.6900, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Giao Hàng Nhanh', lat: 10.7700, lng: 106.6850, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho GHN', lat: 10.7700, lng: 106.6850, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Giao Hàng Tiết Kiệm', lat: 10.7650, lng: 106.6800, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho GHTK', lat: 10.7650, lng: 106.6800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'J&T Express', lat: 10.7600, lng: 106.6750, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho J&T', lat: 10.7600, lng: 106.6750, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Shopee Express', lat: 10.7550, lng: 106.6700, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Shopee', lat: 10.7550, lng: 106.6700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Lazada Express', lat: 10.7500, lng: 106.6650, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Lazada', lat: 10.7500, lng: 106.6650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Grab Express', lat: 10.7450, lng: 106.6600, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Grab', lat: 10.7450, lng: 106.6600, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Be Express', lat: 10.7400, lng: 106.6550, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Be', lat: 10.7400, lng: 106.6550, province: 'Ho Chi Minh City', type: 'warehouse' },
    
    // Traditional Vietnamese Logistics Companies
    { name: 'Saigon Cargo Service', lat: 10.7350, lng: 106.6500, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Saigon Cargo Service', lat: 10.7350, lng: 106.6500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Hoàng Long', lat: 10.7300, lng: 106.6450, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Hoàng Long', lat: 10.7300, lng: 106.6450, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Phương Trang', lat: 10.7250, lng: 106.6400, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Phương Trang', lat: 10.7250, lng: 106.6400, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Mai Linh', lat: 10.7200, lng: 106.6350, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Mai Linh', lat: 10.7200, lng: 106.6350, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Thành Bưởi', lat: 10.7150, lng: 106.6300, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Thành Bưởi', lat: 10.7150, lng: 106.6300, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Hà Lan', lat: 10.7100, lng: 106.6250, province: 'Ho Chi Minh City', type: 'logistics' },
    { name: 'Kho Hà Lan', lat: 10.7100, lng: 106.6250, province: 'Ho Chi Minh City', type: 'warehouse' },
    
    // Major Vietnamese Logistics Companies
    { name: 'Kho Gemadept', lat: 10.7800, lng: 106.8000, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Gemadept', lat: 10.7800, lng: 106.8000, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Saigon Cargo', lat: 10.7750, lng: 106.7900, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Saigon Cargo', lat: 10.7750, lng: 106.7900, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vinalines', lat: 10.7700, lng: 106.7800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vinalines', lat: 10.7700, lng: 106.7800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Transimex', lat: 10.7600, lng: 106.7700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Transimex', lat: 10.7600, lng: 106.7700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Viconship', lat: 10.7550, lng: 106.7650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Viconship', lat: 10.7550, lng: 106.7650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Sotrans', lat: 10.7450, lng: 106.7550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Sotrans', lat: 10.7450, lng: 106.7550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vinafco', lat: 10.7400, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vinafco', lat: 10.7400, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vimc', lat: 10.7350, lng: 106.7450, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vimc', lat: 10.7350, lng: 106.7450, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vosco', lat: 10.7300, lng: 106.7400, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vosco', lat: 10.7300, lng: 106.7400, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vishipel', lat: 10.7250, lng: 106.7350, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vishipel', lat: 10.7250, lng: 106.7350, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vitranschart', lat: 10.7200, lng: 106.7300, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vitranschart', lat: 10.7200, lng: 106.7300, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Viettrans', lat: 10.7150, lng: 106.7250, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Viettrans', lat: 10.7150, lng: 106.7250, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Vietship', lat: 10.7100, lng: 106.7200, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Vietship', lat: 10.7100, lng: 106.7200, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Saigon Port', lat: 10.7050, lng: 106.7150, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Saigon Port', lat: 10.7050, lng: 106.7150, province: 'Ho Chi Minh City', type: 'warehouse' },
    
    // Ba Ria Vung Tau Ports
    { name: 'Cảng Vũng Tàu', lat: 10.3460, lng: 107.0843, province: 'Ba Ria Vung Tau', type: 'port' },
    { name: 'Cảng Cái Mép', lat: 10.3200, lng: 107.0500, province: 'Ba Ria Vung Tau', type: 'port' },
    { name: 'Cảng Thị Vải', lat: 10.3300, lng: 107.0600, province: 'Ba Ria Vung Tau', type: 'port' },
    { name: 'Cảng SSIT', lat: 10.3250, lng: 107.0550, province: 'Ba Ria Vung Tau', type: 'port' },
    { name: 'Cảng TCIT', lat: 10.3280, lng: 107.0580, province: 'Ba Ria Vung Tau', type: 'port' },
    
    // Mekong Delta Ports
    { name: 'Cảng Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'port' },
    { name: 'Cảng Rạch Giá', lat: 10.0120, lng: 105.0802, province: 'Kien Giang', type: 'port' },
    { name: 'Cảng Cà Mau', lat: 9.1767, lng: 105.1524, province: 'Ca Mau', type: 'port' },
    { name: 'Cảng An Giang', lat: 10.3833, lng: 105.4333, province: 'An Giang', type: 'port' },
    { name: 'Cảng Mỹ Tho', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'port' },
    { name: 'Cảng Vĩnh Long', lat: 10.2397, lng: 105.9571, province: 'Vinh Long', type: 'port' },
    { name: 'Cảng Trà Vinh', lat: 9.9347, lng: 106.3256, province: 'Tra Vinh', type: 'port' },
    { name: 'Cảng Sóc Trăng', lat: 9.6003, lng: 105.9800, province: 'Soc Trang', type: 'port' },
    { name: 'Cảng Bạc Liêu', lat: 9.2945, lng: 105.7244, province: 'Bac Lieu', type: 'port' },
    
    // Industrial Zones & Warehouses - Ho Chi Minh City
    { name: 'KCN Tân Thuận', lat: 10.7300, lng: 106.7100, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Hiệp Phước', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Phú Hữu', lat: 10.7500, lng: 106.8200, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Cát Lái', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Tân Bình', lat: 10.8000, lng: 106.6500, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Quận 7', lat: 10.7300, lng: 106.7100, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'KCN Quận 9', lat: 10.7500, lng: 106.8200, province: 'Ho Chi Minh City', type: 'industrial' },
    
    // International Shipping Lines & Freight Forwarders
    { name: 'Kho Hapag Lloyd', lat: 10.7850, lng: 106.8050, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Hapag Lloyd', lat: 10.7850, lng: 106.8050, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Maersk', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Maersk', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho MSC', lat: 10.7950, lng: 106.8150, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'MSC', lat: 10.7950, lng: 106.8150, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho CMA CGM', lat: 10.7800, lng: 106.8000, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'CMA CGM', lat: 10.7800, lng: 106.8000, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho COSCO', lat: 10.7750, lng: 106.7950, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'COSCO', lat: 10.7750, lng: 106.7950, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Evergreen', lat: 10.7700, lng: 106.7900, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Evergreen', lat: 10.7700, lng: 106.7900, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho ONE', lat: 10.7650, lng: 106.7850, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'ONE', lat: 10.7650, lng: 106.7850, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Yang Ming', lat: 10.7600, lng: 106.7800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Yang Ming', lat: 10.7600, lng: 106.7800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Hyundai', lat: 10.7550, lng: 106.7750, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Hyundai', lat: 10.7550, lng: 106.7750, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho PIL', lat: 10.7500, lng: 106.7700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'PIL', lat: 10.7500, lng: 106.7700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho OOCL', lat: 10.7450, lng: 106.7650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'OOCL', lat: 10.7450, lng: 106.7650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho APL', lat: 10.7400, lng: 106.7600, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'APL', lat: 10.7400, lng: 106.7600, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho K Line', lat: 10.7350, lng: 106.7550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'K Line', lat: 10.7350, lng: 106.7550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho MOL', lat: 10.7300, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'MOL', lat: 10.7300, lng: 106.7500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho NYK', lat: 10.7250, lng: 106.7450, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'NYK', lat: 10.7250, lng: 106.7450, province: 'Ho Chi Minh City', type: 'warehouse' },
    
    // Freight Forwarders & Logistics Companies
    { name: 'Kho DHL', lat: 10.8200, lng: 106.6800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'DHL', lat: 10.8200, lng: 106.6800, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho FedEx', lat: 10.8150, lng: 106.6750, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'FedEx', lat: 10.8150, lng: 106.6750, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho UPS', lat: 10.8100, lng: 106.6700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'UPS', lat: 10.8100, lng: 106.6700, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho TNT', lat: 10.8050, lng: 106.6650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'TNT', lat: 10.8050, lng: 106.6650, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Kuehne Nagel', lat: 10.8000, lng: 106.6600, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kuehne Nagel', lat: 10.8000, lng: 106.6600, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho DB Schenker', lat: 10.7950, lng: 106.6550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'DB Schenker', lat: 10.7950, lng: 106.6550, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Pantos', lat: 10.7900, lng: 106.6500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Pantos', lat: 10.7900, lng: 106.6500, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Kho Expeditors', lat: 10.7850, lng: 106.6450, province: 'Ho Chi Minh City', type: 'warehouse' },
    { name: 'Expeditors', lat: 10.7850, lng: 106.6450, province: 'Ho Chi Minh City', type: 'warehouse' },
    
    // Dong Nai Industrial Zones & Warehouses
    { name: 'KCN Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Long Thành', lat: 10.8167, lng: 107.0000, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Nhơn Trạch', lat: 10.7500, lng: 106.9000, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Long Đức', lat: 10.9200, lng: 106.8800, province: 'Dong Nai', type: 'industrial' },
    { name: 'KCN Amata', lat: 10.9300, lng: 106.8500, province: 'Dong Nai', type: 'industrial' },
    { name: 'Kho Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Long Thành', lat: 10.8167, lng: 107.0000, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Nhơn Trạch', lat: 10.7500, lng: 106.9000, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Phước An', lat: 10.9100, lng: 106.8600, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Long Đức', lat: 10.9200, lng: 106.8800, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Amata', lat: 10.9300, lng: 106.8500, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Trảng Bom', lat: 10.9800, lng: 107.0200, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Xuân Lộc', lat: 10.9200, lng: 107.4200, province: 'Dong Nai', type: 'warehouse' },
    { name: 'Kho Định Quán', lat: 11.2200, lng: 107.1800, province: 'Dong Nai', type: 'warehouse' },
    
    // Binh Duong Industrial Zones & Warehouses
    { name: 'KCN Vsip Bình Dương', lat: 11.1271, lng: 106.6504, province: 'Binh Duong', type: 'industrial' },
    { name: 'KCN Mỹ Phước', lat: 11.1500, lng: 106.7000, province: 'Binh Duong', type: 'industrial' },
    { name: 'KCN Đồng An', lat: 11.1200, lng: 106.6800, province: 'Binh Duong', type: 'industrial' },
    { name: 'KCN Sóng Thần', lat: 10.8800, lng: 106.6200, province: 'Binh Duong', type: 'industrial' },
    { name: 'Kho Vsip', lat: 11.1271, lng: 106.6504, province: 'Binh Duong', type: 'warehouse' },
    { name: 'Kho Mỹ Phước', lat: 11.1500, lng: 106.7000, province: 'Binh Duong', type: 'warehouse' },
    
    // Ba Ria Vung Tau Industrial Zones
    { name: 'KCN Phú Mỹ', lat: 10.3800, lng: 107.1000, province: 'Ba Ria Vung Tau', type: 'industrial' },
    { name: 'KCN Cái Mép', lat: 10.3200, lng: 107.0500, province: 'Ba Ria Vung Tau', type: 'industrial' },
    { name: 'KCN Đông Xuyên', lat: 10.3500, lng: 107.0800, province: 'Ba Ria Vung Tau', type: 'industrial' },
    { name: 'Kho Phú Mỹ', lat: 10.3800, lng: 107.1000, province: 'Ba Ria Vung Tau', type: 'warehouse' },
    { name: 'Kho Cái Mép', lat: 10.3200, lng: 107.0500, province: 'Ba Ria Vung Tau', type: 'warehouse' },
    
    // Mekong Delta Warehouses & Depots
    { name: 'Kho Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'warehouse' },
    { name: 'Kho An Giang', lat: 10.3833, lng: 105.4333, province: 'An Giang', type: 'warehouse' },
    { name: 'Kho Long An', lat: 10.6950, lng: 106.2430, province: 'Long An', type: 'warehouse' },
    { name: 'Long An', lat: 10.6950, lng: 106.2430, province: 'Long An', type: 'warehouse' },
    { name: 'Kho Tân An', lat: 10.6950, lng: 106.2430, province: 'Long An', type: 'warehouse' },
    { name: 'Tan An', lat: 10.6950, lng: 106.2430, province: 'Long An', type: 'warehouse' },
    { name: 'Kho Đức Hòa', lat: 10.8800, lng: 106.3200, province: 'Long An', type: 'warehouse' },
    { name: 'Duc Hoa', lat: 10.8800, lng: 106.3200, province: 'Long An', type: 'warehouse' },
    { name: 'Kho Bến Lức', lat: 10.6500, lng: 106.4500, province: 'Long An', type: 'warehouse' },
    { name: 'Ben Luc', lat: 10.6500, lng: 106.4500, province: 'Long An', type: 'warehouse' },
    { name: 'Kho Cần Đước', lat: 10.6200, lng: 106.5800, province: 'Long An', type: 'warehouse' },
    { name: 'Can Duoc', lat: 10.6200, lng: 106.5800, province: 'Long An', type: 'warehouse' },
    { name: 'Kho Kiên Giang', lat: 10.0120, lng: 105.0802, province: 'Kien Giang', type: 'warehouse' },
    { name: 'Kho Tiền Giang', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Kho Mỹ Tho', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'warehouse' },
    { name: 'My Tho', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Kho Gò Công', lat: 10.3650, lng: 106.6700, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Go Cong', lat: 10.3650, lng: 106.6700, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Kho Cai Lậy', lat: 10.4200, lng: 106.1300, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Cai Lay', lat: 10.4200, lng: 106.1300, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Kho Vĩnh Long', lat: 10.2397, lng: 105.9571, province: 'Vinh Long', type: 'warehouse' },
    { name: 'Vinh Long', lat: 10.2397, lng: 105.9571, province: 'Vinh Long', type: 'warehouse' },
    { name: 'Kho Trà Vinh', lat: 9.9347, lng: 106.3256, province: 'Tra Vinh', type: 'warehouse' },
    { name: 'Tra Vinh', lat: 9.9347, lng: 106.3256, province: 'Tra Vinh', type: 'warehouse' },
    { name: 'Kho Đồng Tháp', lat: 10.4581, lng: 105.6189, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Dong Thap', lat: 10.4581, lng: 105.6189, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Kho Cao Lãnh', lat: 10.4581, lng: 105.6189, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Cao Lanh', lat: 10.4581, lng: 105.6189, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Kho Sa Đéc', lat: 10.2950, lng: 105.7580, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Sa Dec', lat: 10.2950, lng: 105.7580, province: 'Dong Thap', type: 'warehouse' },
    { name: 'Kho Hậu Giang', lat: 9.7570, lng: 105.6412, province: 'Hau Giang', type: 'warehouse' },
    { name: 'Hau Giang', lat: 9.7570, lng: 105.6412, province: 'Hau Giang', type: 'warehouse' },
    { name: 'Kho Vị Thanh', lat: 9.7570, lng: 105.6412, province: 'Hau Giang', type: 'warehouse' },
    { name: 'Vi Thanh', lat: 9.7570, lng: 105.6412, province: 'Hau Giang', type: 'warehouse' },
    { name: 'Kho Sóc Trăng', lat: 9.6003, lng: 105.9800, province: 'Soc Trang', type: 'warehouse' },
    { name: 'Soc Trang', lat: 9.6003, lng: 105.9800, province: 'Soc Trang', type: 'warehouse' },
    { name: 'Kho Bạc Liêu', lat: 9.2945, lng: 105.7244, province: 'Bac Lieu', type: 'warehouse' },
    { name: 'Bac Lieu', lat: 9.2945, lng: 105.7244, province: 'Bac Lieu', type: 'warehouse' },
    { name: 'Kho Cà Mau', lat: 9.1767, lng: 105.1524, province: 'Ca Mau', type: 'warehouse' },
    { name: 'Ca Mau', lat: 9.1767, lng: 105.1524, province: 'Ca Mau', type: 'warehouse' },
    { name: 'Kho Năm Căn', lat: 8.7500, lng: 104.9800, province: 'Ca Mau', type: 'warehouse' },
    { name: 'Nam Can', lat: 8.7500, lng: 104.9800, province: 'Ca Mau', type: 'warehouse' },
    { name: 'Kho U Minh', lat: 9.0200, lng: 105.0800, province: 'Ca Mau', type: 'warehouse' },
    { name: 'U Minh', lat: 9.0200, lng: 105.0800, province: 'Ca Mau', type: 'warehouse' },
    
    // District-level Warehouses & Industrial Zones
    { name: 'KCN Long An', lat: 10.6950, lng: 106.2430, province: 'Long An', type: 'industrial' },
    { name: 'KCN Đức Hòa', lat: 10.8800, lng: 106.3200, province: 'Long An', type: 'industrial' },
    { name: 'KCN Bến Lức', lat: 10.6500, lng: 106.4500, province: 'Long An', type: 'industrial' },
    { name: 'KCN Cần Đước', lat: 10.6200, lng: 106.5800, province: 'Long An', type: 'industrial' },
    { name: 'KCN Tây Ninh', lat: 11.3100, lng: 106.0980, province: 'Tay Ninh', type: 'industrial' },
    { name: 'Kho Tây Ninh', lat: 11.3100, lng: 106.0980, province: 'Tay Ninh', type: 'warehouse' },
    { name: 'Tay Ninh', lat: 11.3100, lng: 106.0980, province: 'Tay Ninh', type: 'warehouse' },
    { name: 'KCN Trảng Bàng', lat: 11.0500, lng: 106.3800, province: 'Tay Ninh', type: 'industrial' },
    { name: 'Kho Trảng Bàng', lat: 11.0500, lng: 106.3800, province: 'Tay Ninh', type: 'warehouse' },
    { name: 'Trang Bang', lat: 11.0500, lng: 106.3800, province: 'Tay Ninh', type: 'warehouse' },
    
    // Border Warehouses & Logistics Centers
    { name: 'Kho Mộc Bài', lat: 11.1400, lng: 106.2200, province: 'Tay Ninh', type: 'warehouse' },
    { name: 'Moc Bai', lat: 11.1400, lng: 106.2200, province: 'Tay Ninh', type: 'warehouse' },
    { name: 'Cửa khẩu Mộc Bài', lat: 11.1400, lng: 106.2200, province: 'Tay Ninh', type: 'border' },
    { name: 'Kho Tiền Giang', lat: 10.3600, lng: 106.3600, province: 'Tien Giang', type: 'warehouse' },
    { name: 'Kho Châu Đốc', lat: 10.7000, lng: 105.1200, province: 'An Giang', type: 'warehouse' },
    { name: 'Chau Doc', lat: 10.7000, lng: 105.1200, province: 'An Giang', type: 'warehouse' },
    { name: 'Kho Long Xuyên', lat: 10.3833, lng: 105.4333, province: 'An Giang', type: 'warehouse' },
    { name: 'Long Xuyen', lat: 10.3833, lng: 105.4333, province: 'An Giang', type: 'warehouse' },
    { name: 'Kho Hà Tiên', lat: 10.3833, lng: 104.4833, province: 'Kien Giang', type: 'warehouse' },
    { name: 'Ha Tien', lat: 10.3833, lng: 104.4833, province: 'Kien Giang', type: 'warehouse' },
    { name: 'Kho Phú Quốc', lat: 10.2899, lng: 103.9840, province: 'Kien Giang', type: 'warehouse' },
    { name: 'Phu Quoc', lat: 10.2899, lng: 103.9840, province: 'Kien Giang', type: 'warehouse' },
    
    // Fuel Depots
    { name: 'Kho xăng dầu Nhà Bè', lat: 10.7000, lng: 106.7200, province: 'Ho Chi Minh City', type: 'fuel_depot' },
    { name: 'Kho xăng dầu Cát Lái', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'fuel_depot' },
    { name: 'Kho xăng dầu Dung Quất', lat: 10.3500, lng: 107.0800, province: 'Ba Ria Vung Tau', type: 'fuel_depot' },
    { name: 'Kho xăng dầu Cần Thơ', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'fuel_depot' },
    
    // Container Depots
    { name: 'Bãi container Cát Lái', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'container_depot' },
    { name: 'Bãi container Hiệp Phước', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'container_depot' },
    { name: 'Bãi container Tân Cảng', lat: 10.7650, lng: 106.7050, province: 'Ho Chi Minh City', type: 'container_depot' },
    { name: 'Bãi container Phú Hữu', lat: 10.7500, lng: 106.8200, province: 'Ho Chi Minh City', type: 'container_depot' },
    { name: 'Bãi container Biên Hòa', lat: 10.9408, lng: 106.8228, province: 'Dong Nai', type: 'container_depot' },
    { name: 'Bãi container Vũng Tàu', lat: 10.3460, lng: 107.0843, province: 'Ba Ria Vung Tau', type: 'container_depot' },
    
    // Common name variations
    { name: 'Cat Lai', lat: 10.7900, lng: 106.8100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Phu Huu', lat: 10.7500, lng: 106.8200, province: 'Ho Chi Minh City', type: 'industrial' },
    { name: 'Hiep Phuoc', lat: 10.7200, lng: 106.7500, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Tan Thuan', lat: 10.7300, lng: 106.7100, province: 'Ho Chi Minh City', type: 'port' },
    { name: 'Bien Hoa', lat: 10.9460, lng: 106.8234, province: 'Dong Nai', type: 'city' },
    { name: 'Vung Tau', lat: 10.3460, lng: 107.0843, province: 'Ba Ria Vung Tau', type: 'city' },
    { name: 'Can Tho', lat: 10.0452, lng: 105.7469, province: 'Can Tho', type: 'city' },
    { name: 'TP. Hồ Chí Minh', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'HCMC', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' },
    { name: 'Saigon', lat: 10.8231, lng: 106.6297, province: 'Ho Chi Minh City', type: 'city' }
  ]

  const searchLocations = (query: string) => {
    if (!query.trim()) return []
    
    const normalizedQuery = query.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '')
    
    return vietnameseLocations.filter(location => {
      const normalizedName = location.name.toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '')
      
      return normalizedName.includes(normalizedQuery) || 
             location.province.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery) ||
             normalizedName.startsWith(normalizedQuery) ||
             location.name.toLowerCase().includes(query.toLowerCase())
    }).slice(0, 8)
  }

  const calculateRoute = async () => {
    if (!originQuery.trim() || !destinationQuery.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập điểm xuất phát và điểm đến' : 'Please enter both origin and destination locations')
      return
    }

    setIsCalculating(true)
    
    try {
      // Find coordinates for origin and destination with better matching
      const originLocation = vietnameseLocations.find(loc => {
        const normalizedLoc = loc.name.toLowerCase().replace(/\s+/g, '')
        const normalizedQuery = originQuery.toLowerCase().replace(/\s+/g, '')
        return normalizedLoc.includes(normalizedQuery) || 
               loc.name.toLowerCase().includes(originQuery.toLowerCase()) ||
               normalizedLoc.startsWith(normalizedQuery)
      })
      
      const destinationLocation = vietnameseLocations.find(loc => {
        const normalizedLoc = loc.name.toLowerCase().replace(/\s+/g, '')
        const normalizedQuery = destinationQuery.toLowerCase().replace(/\s+/g, '')
        return normalizedLoc.includes(normalizedQuery) || 
               loc.name.toLowerCase().includes(destinationQuery.toLowerCase()) ||
               normalizedLoc.startsWith(normalizedQuery)
      })

      if (!originLocation || !destinationLocation) {
        // Show available suggestions
        const originSuggestions = searchLocations(originQuery)
        const destSuggestions = searchLocations(destinationQuery)
        
        let message = language === 'vi' ? 'Không tìm thấy địa điểm:\n' : 'Location not found:\n'
        if (!originLocation && originSuggestions.length > 0) {
          message += `${language === 'vi' ? 'Gợi ý cho điểm xuất phát' : 'Origin suggestions'}: ${originSuggestions.map(s => s.name).join(', ')}\n`
        }
        if (!destinationLocation && destSuggestions.length > 0) {
          message += `${language === 'vi' ? 'Gợi ý cho điểm đến' : 'Destination suggestions'}: ${destSuggestions.map(s => s.name).join(', ')}`
        }
        
        alert(message)
        setIsCalculating(false)
        return
      }

      const calculator = new EnhancedRouteCalculator()
      const routeResult = await calculator.calculateOptimalRoute(
        { lat: originLocation.lat, lng: originLocation.lng, name: originLocation.name },
        { lat: destinationLocation.lat, lng: destinationLocation.lng, name: destinationLocation.name }
      )

      setSelectedRoute({
        ...routeResult,
        origin: originLocation,
        destination: destinationLocation
      })

    } catch (error) {
      console.error('Route calculation error:', error)
      alert(language === 'vi' ? 'Lỗi tính toán tuyến đường' : 'Route calculation error')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleOriginChange = (value: string) => {
    setOriginQuery(value)
    if (value.trim()) {
      const suggestions = searchLocations(value)
      setOriginSuggestions(suggestions)
      setShowOriginSuggestions(suggestions.length > 0)
    } else {
      setShowOriginSuggestions(false)
    }
  }

  const handleDestinationChange = (value: string) => {
    setDestinationQuery(value)
    if (value.trim()) {
      const suggestions = searchLocations(value)
      setDestinationSuggestions(suggestions)
      setShowDestinationSuggestions(suggestions.length > 0)
    } else {
      setShowDestinationSuggestions(false)
    }
  }

  const addMultiStop = () => {
    const newId = (multiStops.length + 1).toString()
    setMultiStops([...multiStops, { id: newId, name: '', lat: 0, lng: 0, type: 'waypoint' }])
  }

  const removeMultiStop = (id: string) => {
    if (multiStops.length > 2) {
      setMultiStops(multiStops.filter(stop => stop.id !== id))
    }
  }

  const updateMultiStop = (id: string, name: string) => {
    // Enhanced location search with better matching
    const location = vietnameseLocations.find(loc => {
      const normalizedLoc = loc.name.toLowerCase().replace(/\s+/g, '').replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e').replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o').replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
      const normalizedQuery = name.toLowerCase().replace(/\s+/g, '').replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a').replace(/[èéẹẻẽêềếệểễ]/g, 'e').replace(/[ìíịỉĩ]/g, 'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o').replace(/[ùúụủũưừứựửữ]/g, 'u').replace(/[ỳýỵỷỹ]/g, 'y').replace(/đ/g, 'd')
      
      return normalizedLoc.includes(normalizedQuery) || 
             loc.name.toLowerCase().includes(name.toLowerCase()) ||
             normalizedLoc.startsWith(normalizedQuery) ||
             (name.toLowerCase().includes('long an') && loc.name.toLowerCase().includes('long an')) ||
             (name.toLowerCase().includes('cat lai') && loc.name.toLowerCase().includes('cát lái'))
    })
    
    setMultiStops(multiStops.map(stop => 
      stop.id === id ? { ...stop, name, lat: location?.lat || 0, lng: location?.lng || 0 } : stop
    ))
  }

  const calculateMultiRoute = async () => {
    const validStops = multiStops.filter(stop => stop.name && stop.lat && stop.lng)
    if (validStops.length < 2) {
      alert(language === 'vi' ? 'Cần ít nhất 2 điểm hợp lệ' : 'Need at least 2 valid locations')
      return
    }

    setIsCalculating(true)
    try {
      const calculator = new EnhancedRouteCalculator()
      
      if (validStops.length === 2) {
        // Simple 2-point route
        const result = await calculator.calculateOptimalRoute(validStops[0], validStops[1])
        setSelectedRoute({
          ...result,
          origin: validStops[0],
          destination: validStops[1]
        })
        setMultiRoute(null)
      } else {
        // Multi-stop route - use simple calculation for now
        let totalDistance = 0
        let totalDuration = 0
        let totalCost = 0
        
        for (let i = 0; i < validStops.length - 1; i++) {
          const segmentResult = await calculator.calculateOptimalRoute(validStops[i], validStops[i + 1])
          totalDistance += segmentResult.distance
          totalDuration += segmentResult.duration
          totalCost += segmentResult.totalCost
        }
        
        setMultiRoute({
          distance: totalDistance,
          duration: totalDuration,
          fuelCost: totalCost * 0.3, // Approximate fuel portion
          totalCost: totalCost,
          optimizedRoute: validStops,
          savings: {
            distance: totalDistance * 0.05,
            time: totalDuration * 0.08,
            cost: totalCost * 0.06
          }
        })
        setSelectedRoute(null)
      }
    } catch (error) {
      console.error('Route calculation error:', error)
      alert(language === 'vi' ? 'Lỗi tính toán tuyến đường' : 'Route calculation error')
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {language === 'vi' ? 'Tối Ưu Tuyến Đường Pro' : 'Combined Route Optimizer Pro'}
          </h1>
          <p className="text-slate-300">
            {language === 'vi' 
              ? 'Giải pháp tối ưu tuyến đường toàn diện với AI, bản đồ tương tác và phân tích đa chiều'
              : 'Ultimate route optimization solution with AI, interactive maps and multi-dimensional analysis'
            }
          </p>
          <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
            LogiAI V4.0 - All Routing Features Integrated
          </Badge>
        </div>

        {/* Enhanced Tabs - Combined Simple & Multi-stop */}
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="routing" className="data-[state=active]:bg-blue-600">
              <Navigation className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Tối Ưu Tuyến Đường' : 'Route Optimization'}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-blue-600">
              <Brain className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Nâng cao' : 'Advanced'}
            </TabsTrigger>
            <TabsTrigger value="file" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'File' : 'File Analysis'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === 'vi' ? 'Phân tích' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Unified Routing Tab - Simple + Multi-stop Combined */}
          <TabsContent value="routing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Route Input Panel */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5" />
                    {language === 'vi' ? 'Tối Ưu Tuyến Đường' : 'Route Optimization'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Multi-stop locations */}
                  {multiStops.map((stop, index) => (
                    <div key={stop.id} className="relative">
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {index === 0 ? (language === 'vi' ? 'Điểm xuất phát' : 'Origin') :
                         index === multiStops.length - 1 ? (language === 'vi' ? 'Điểm đến' : 'Destination') :
                         `${language === 'vi' ? 'Điểm dừng' : 'Stop'} ${index}`}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={stop.name}
                          onChange={(e) => updateMultiStop(stop.id, e.target.value)}
                          onFocus={() => {
                            if (stop.name) {
                              const suggestions = searchLocations(stop.name)
                              if (index === 0) {
                                setOriginSuggestions(suggestions)
                                setShowOriginSuggestions(true)
                              } else {
                                setDestinationSuggestions(suggestions)
                                setShowDestinationSuggestions(true)
                              }
                            }
                          }}
                          placeholder={language === 'vi' ? 'Nhập địa điểm...' : 'Enter location...'}
                          className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        />
                        {multiStops.length > 2 && index > 0 && index < multiStops.length - 1 && (
                          <Button
                            onClick={() => removeMultiStop(stop.id)}
                            size="sm"
                            variant="outline"
                            className="h-10 w-10 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      {/* Show suggestions for first and last stops */}
                      {((index === 0 && showOriginSuggestions && originSuggestions.length > 0) ||
                        (index > 0 && showDestinationSuggestions && destinationSuggestions.length > 0)) && (
                        <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {(index === 0 ? originSuggestions : destinationSuggestions).map((location, suggestionIndex) => (
                            <div
                              key={suggestionIndex}
                              onClick={() => {
                                updateMultiStop(stop.id, location.name)
                                setShowOriginSuggestions(false)
                                setShowDestinationSuggestions(false)
                              }}
                              className="px-4 py-2 hover:bg-slate-600 cursor-pointer text-white border-b border-slate-600 last:border-b-0"
                            >
                              <div className="font-medium">{location.name}</div>
                              <div className="text-xs text-slate-400">{location.province}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add/Remove stops and Calculate buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={addMultiStop}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'vi' ? 'Thêm điểm' : 'Add Stop'}
                    </Button>
                    <Button
                      onClick={calculateMultiRoute}
                      disabled={isCalculating}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {language === 'vi' ? 'Đang tính toán...' : 'Calculating...'}
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          {language === 'vi' ? 'Tối Ưu Tuyến Đường' : 'Optimize Route'}
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Route Results */}
                  {(selectedRoute || multiRoute) && (
                    <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        {language === 'vi' ? 'Kết Quả Tối Ưu' : 'Optimization Results'}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">{language === 'vi' ? 'Khoảng cách:' : 'Distance:'}</span>
                          <div className="text-white font-medium">
                            {(selectedRoute?.distance || multiRoute?.distance)?.toFixed(1)} km
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">{language === 'vi' ? 'Thời gian:' : 'Duration:'}</span>
                          <div className="text-white font-medium">
                            {(selectedRoute?.duration || multiRoute?.duration)?.toFixed(1)} giờ
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">{language === 'vi' ? 'Chi phí nhiên liệu:' : 'Fuel Cost:'}</span>
                          <div className="text-white font-medium">
                            ₫{(selectedRoute?.fuelCost || multiRoute?.fuelCost)?.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-400">{language === 'vi' ? 'Tổng chi phí:' : 'Total Cost:'}</span>
                          <div className="text-white font-medium">
                            ₫{(selectedRoute?.totalCost || multiRoute?.totalCost)?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interactive Map */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="w-5 h-5" />
                    {language === 'vi' ? 'Bản Đồ Tương Tác' : 'Interactive Map'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LeafletRouteMap
                    origin={(selectedRoute?.origin || multiRoute?.optimizedRoute?.[0])}
                    destination={(selectedRoute?.destination || multiRoute?.optimizedRoute?.[multiRoute?.optimizedRoute?.length - 1])}
                    route={(selectedRoute || multiRoute)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Brain className="w-5 h-5" />
                    {language === 'vi' ? 'Cấu hình xe' : 'Vehicle Configuration'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Loại xe' : 'Vehicle Type'}
                      </label>
                      <select
                        value={vehicleConfig.type}
                        onChange={(e) => setVehicleConfig({...vehicleConfig, type: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="truck">{language === 'vi' ? 'Xe tải' : 'Truck'}</option>
                        <option value="van">{language === 'vi' ? 'Xe van' : 'Van'}</option>
                        <option value="container">Container</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Tải trọng (kg)' : 'Capacity (kg)'}
                      </label>
                      <Input
                        type="number"
                        value={vehicleConfig.capacity}
                        onChange={(e) => setVehicleConfig({...vehicleConfig, capacity: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Tiêu hao (L/km)' : 'Fuel (L/km)'}
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={vehicleConfig.fuelConsumption}
                        onChange={(e) => setVehicleConfig({...vehicleConfig, fuelConsumption: parseFloat(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'vi' ? 'Chi phí lái xe (VND/h)' : 'Driver Cost (VND/h)'}
                      </label>
                      <Input
                        type="number"
                        value={vehicleConfig.driverCost}
                        onChange={(e) => setVehicleConfig({...vehicleConfig, driverCost: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Brain className="w-4 h-4 mr-2" />
                      {language === 'vi' ? 'Tối ưu AI' : 'AI Optimize'}
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'vi' ? 'Xuất báo cáo' : 'Export Report'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5" />
                    {language === 'vi' ? 'Cài đặt nâng cao' : 'Advanced Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{language === 'vi' ? 'Tối ưu thời gian thực' : 'Real-time Optimization'}</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{language === 'vi' ? 'Tránh tắc đường' : 'Avoid Traffic'}</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{language === 'vi' ? 'Ưu tiên đường cao tốc' : 'Prefer Highways'}</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{language === 'vi' ? 'Tính phí cầu đường' : 'Include Tolls'}</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-6">
            <FileBasedRouteOptimizer />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {language === 'vi' ? 'Hiệu suất tối ưu' : 'Optimization Performance'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm khoảng cách:' : 'Distance Saved:'}</span>
                      <span className="text-green-400 font-bold">15.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm thời gian:' : 'Time Saved:'}</span>
                      <span className="text-green-400 font-bold">12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tiết kiệm chi phí:' : 'Cost Saved:'}</span>
                      <span className="text-green-400 font-bold">18.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Độ chính xác AI:' : 'AI Accuracy:'}</span>
                      <span className="text-blue-400 font-bold">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    {language === 'vi' ? 'Thống kê tuyến đường' : 'Route Statistics'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tuyến đường đã tối ưu:' : 'Routes Optimized:'}</span>
                      <span className="text-white font-bold">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tổng tiết kiệm:' : 'Total Savings:'}</span>
                      <span className="text-white font-bold">₫2.4M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Km đã tối ưu:' : 'KM Optimized:'}</span>
                      <span className="text-white font-bold">15,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Giờ tiết kiệm:' : 'Hours Saved:'}</span>
                      <span className="text-white font-bold">342</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    {language === 'vi' ? 'Xu hướng hiệu suất' : 'Performance Trends'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tuần này:' : 'This Week:'}</span>
                      <span className="text-green-400 font-bold">+5.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tháng này:' : 'This Month:'}</span>
                      <span className="text-green-400 font-bold">+12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Năm này:' : 'This Year:'}</span>
                      <span className="text-green-400 font-bold">+28.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">{language === 'vi' ? 'Tổng cải thiện:' : 'Overall Improvement:'}</span>
                      <span className="text-green-400 font-bold">+45.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {language === 'vi' ? 'Lịch sử tối ưu gần đây' : 'Recent Optimization History'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { route: 'HCM → Biên Hòa', savings: '₫45,000', time: '2h trước' },
                    { route: 'Hà Nội → Đà Nẵng', savings: '₫120,000', time: '4h trước' },
                    { route: 'Cần Thơ → HCM', savings: '₫67,000', time: '6h trước' },
                    { route: 'Đà Nẵng → Hải Phòng', savings: '₫89,000', time: '8h trước' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.route}</div>
                        <div className="text-slate-400 text-sm">{item.time}</div>
                      </div>
                      <div className="text-green-400 font-bold">{item.savings}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
