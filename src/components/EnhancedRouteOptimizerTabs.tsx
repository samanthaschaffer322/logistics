'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Truck, 
  Settings,
  TrendingUp,
  Brain,
  Clock,
  DollarSign,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Navigation
} from 'lucide-react';

import {
  UnifiedOptimizationConfig,
  UnifiedOptimizationResult,
  Vehicle,
  UnifiedRoute
} from '@/lib/unified-route-optimizer';

interface EnhancedRouteOptimizerTabsProps {
  vehicles: Vehicle[];
  config: UnifiedOptimizationConfig;
  optimizationResult?: UnifiedOptimizationResult;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  onRemoveVehicle: (id: string) => void;
  onAddVehicle: () => void;
  onUpdateConfig: (updates: Partial<UnifiedOptimizationConfig>) => void;
}

export const VehiclesTab: React.FC<{
  vehicles: Vehicle[];
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  onRemoveVehicle: (id: string) => void;
  onAddVehicle: () => void;
}> = ({ vehicles, onUpdateVehicle, onRemoveVehicle, onAddVehicle }) => (
  <TabsContent value="vehicles" className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Fleet Vehicles
          </span>
          <Button onClick={onAddVehicle} size="sm">
            Add Vehicle
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`vehicle-name-${vehicle.id}`}>Vehicle Name</Label>
                  <Input
                    id={`vehicle-name-${vehicle.id}`}
                    value={vehicle.name}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`vehicle-capacity-${vehicle.id}`}>Capacity (kg)</Label>
                  <Input
                    id={`vehicle-capacity-${vehicle.id}`}
                    type="number"
                    min="0"
                    value={vehicle.capacity}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`vehicle-max-distance-${vehicle.id}`}>Max Distance (km)</Label>
                  <Input
                    id={`vehicle-max-distance-${vehicle.id}`}
                    type="number"
                    min="0"
                    value={vehicle.maxDistance}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { maxDistance: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`vehicle-cost-${vehicle.id}`}>Cost per KM ($)</Label>
                  <Input
                    id={`vehicle-cost-${vehicle.id}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={vehicle.costPerKm}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { costPerKm: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor={`vehicle-available-from-${vehicle.id}`}>Available From</Label>
                  <Input
                    id={`vehicle-available-from-${vehicle.id}`}
                    type="time"
                    value={vehicle.availableFrom}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { availableFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`vehicle-available-to-${vehicle.id}`}>Available To</Label>
                  <Input
                    id={`vehicle-available-to-${vehicle.id}`}
                    type="time"
                    value={vehicle.availableTo}
                    onChange={(e) => onUpdateVehicle(vehicle.id, { availableTo: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onRemoveVehicle(vehicle.id)}
                >
                  Remove Vehicle
                </Button>
              </div>
            </Card>
          ))}
          
          {vehicles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No vehicles added yet. Click "Add Vehicle" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

export const SettingsTab: React.FC<{
  config: UnifiedOptimizationConfig;
  onUpdateConfig: (updates: Partial<UnifiedOptimizationConfig>) => void;
}> = ({ config, onUpdateConfig }) => (
  <TabsContent value="settings" className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Optimization Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <Label>Primary Algorithm</Label>
          <Select 
            value={config.preferences.primaryAlgorithm}
            onValueChange={(value) => onUpdateConfig({
              preferences: {
                ...config.preferences,
                primaryAlgorithm: value as any
              }
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enhanced">Enhanced AI Algorithm</SelectItem>
              <SelectItem value="fleetbase">Fleetbase Integration</SelectItem>
              <SelectItem value="aws">AWS Optimization</SelectItem>
              <SelectItem value="hybrid">Hybrid (Best of All)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="real-time-tracking">Real-time Tracking</Label>
            <Switch
              id="real-time-tracking"
              checked={config.preferences.realTimeTracking}
              onCheckedChange={(checked) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  realTimeTracking: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-insights">AI Insights</Label>
            <Switch
              id="ai-insights"
              checked={config.preferences.aiInsights}
              onCheckedChange={(checked) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  aiInsights: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="cloud-sync">Cloud Sync</Label>
            <Switch
              id="cloud-sync"
              checked={config.preferences.cloudSync}
              onCheckedChange={(checked) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  cloudSync: checked
                }
              })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="cache-results">Cache Results</Label>
            <Switch
              id="cache-results"
              checked={config.preferences.cacheResults}
              onCheckedChange={(checked) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  cacheResults: checked
                }
              })}
            />
          </div>
        </div>

        {/* Performance Settings */}
        <div className="space-y-4">
          <div>
            <Label>Max Compute Time (seconds): {config.preferences.maxComputeTime}</Label>
            <Slider
              value={[config.preferences.maxComputeTime]}
              onValueChange={([value]) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  maxComputeTime: value
                }
              })}
              min={30}
              max={600}
              step={30}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label>Quality Threshold (%): {config.preferences.qualityThreshold}</Label>
            <Slider
              value={[config.preferences.qualityThreshold]}
              onValueChange={([value]) => onUpdateConfig({
                preferences: {
                  ...config.preferences,
                  qualityThreshold: value
                }
              })}
              min={50}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        </div>

        {/* API Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">API Configuration</h3>
          
          <div>
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="password"
              placeholder="sk-..."
              value={config.openaiApiKey || ''}
              onChange={(e) => onUpdateConfig({ openaiApiKey: e.target.value })}
            />
          </div>
          
          {/* Fleetbase Config */}
          <div className="space-y-2">
            <Label>Fleetbase Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                placeholder="API URL"
                value={config.fleetbase?.apiUrl || ''}
                onChange={(e) => onUpdateConfig({
                  fleetbase: {
                    ...config.fleetbase,
                    apiUrl: e.target.value,
                    apiKey: config.fleetbase?.apiKey || ''
                  }
                })}
              />
              <Input
                type="password"
                placeholder="API Key"
                value={config.fleetbase?.apiKey || ''}
                onChange={(e) => onUpdateConfig({
                  fleetbase: {
                    ...config.fleetbase,
                    apiUrl: config.fleetbase?.apiUrl || '',
                    apiKey: e.target.value
                  }
                })}
              />
            </div>
          </div>
          
          {/* AWS Config */}
          <div className="space-y-2">
            <Label>AWS Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Region"
                value={config.aws?.region || ''}
                onChange={(e) => onUpdateConfig({
                  aws: {
                    ...config.aws,
                    region: e.target.value
                  }
                })}
              />
              <Input
                type="password"
                placeholder="Access Key ID"
                value={config.aws?.accessKeyId || ''}
                onChange={(e) => onUpdateConfig({
                  aws: {
                    ...config.aws,
                    region: config.aws?.region || '',
                    accessKeyId: e.target.value
                  }
                })}
              />
              <Input
                type="password"
                placeholder="Secret Access Key"
                value={config.aws?.secretAccessKey || ''}
                onChange={(e) => onUpdateConfig({
                  aws: {
                    ...config.aws,
                    region: config.aws?.region || '',
                    secretAccessKey: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

export const ResultsTab: React.FC<{
  result?: UnifiedOptimizationResult;
}> = ({ result }) => (
  <TabsContent value="results" className="space-y-4">
    {result ? (
      <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Distance</p>
                  <p className="text-2xl font-bold">{result.summary.totalDistance.toFixed(1)} km</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold">{Math.round(result.summary.totalTime / 60)}h {result.summary.totalTime % 60}m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold">${result.summary.totalCost.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Efficiency</p>
                  <p className="text-2xl font-bold">{result.summary.efficiency.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Routes Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Optimized Routes
              <Badge variant="secondary">{result.summary.algorithmUsed}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.routes.map((route, index) => (
                <Card key={route.vehicleId} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Route {index + 1} - {route.vehicleId}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant="outline">{route.locations.length} stops</Badge>
                      <Badge variant="outline">{route.distance.toFixed(1)} km</Badge>
                      <Badge variant="outline">{Math.round(route.time)} min</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-600">Distance:</span> {route.distance.toFixed(1)} km
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Time:</span> {Math.round(route.time)} minutes
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Cost:</span> ${route.cost.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Route Sequence:</h4>
                    <div className="flex flex-wrap gap-2">
                      {route.locations.map((location, locIndex) => (
                        <Badge key={location.id} variant="secondary">
                          {locIndex + 1}. {location.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Carbon Footprint</p>
                <p className="text-lg font-semibold">{result.summary.carbonFootprint.toFixed(2)} kg CO₂</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
                <p className="text-lg font-semibold">{result.summary.customerSatisfactionScore.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Driver Workload Balance</p>
                <p className="text-lg font-semibold">{result.summary.driverWorkloadBalance.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fuel Consumption</p>
                <p className="text-lg font-semibold">{result.summary.fuelConsumption.toFixed(2)} L</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    ) : (
      <Card>
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Yet</h3>
          <p className="text-gray-500">Run an optimization to see results here.</p>
        </CardContent>
      </Card>
    )}
  </TabsContent>
);

export const InsightsTab: React.FC<{
  result?: UnifiedOptimizationResult;
}> = ({ result }) => (
  <TabsContent value="insights" className="space-y-4">
    {result?.insights ? (
      <>
        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.insights.aiRecommendations.length > 0 ? (
              <div className="space-y-3">
                {result.insights.aiRecommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No AI recommendations available.</p>
            )}
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Overall Risk Level:</span>
                <Badge 
                  variant={
                    result.insights.riskAssessment.overallRisk === 'low' ? 'secondary' :
                    result.insights.riskAssessment.overallRisk === 'medium' ? 'default' :
                    result.insights.riskAssessment.overallRisk === 'high' ? 'destructive' : 'destructive'
                  }
                >
                  {result.insights.riskAssessment.overallRisk.toUpperCase()}
                </Badge>
              </div>
              
              {result.insights.riskAssessment.risks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Identified Risks:</h4>
                  {result.insights.riskAssessment.risks.map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{risk.type.replace('_', ' ')}</span>
                        <Badge variant="outline">
                          {Math.round(risk.probability * 100)}% probability
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{risk.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {result.insights.riskAssessment.mitigationStrategies.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Mitigation Strategies:</h4>
                  <ul className="space-y-1">
                    {result.insights.riskAssessment.mitigationStrategies.map((strategy, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cost Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Fuel Costs</p>
                  <p className="text-lg font-semibold">${result.insights.costAnalysis.breakdown.fuel.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Labor Costs</p>
                  <p className="text-lg font-semibold">${result.insights.costAnalysis.breakdown.labor.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle Costs</p>
                  <p className="text-lg font-semibold">${result.insights.costAnalysis.breakdown.vehicle.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost per Delivery</p>
                  <p className="text-lg font-semibold">${result.insights.costAnalysis.costPerDelivery.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cost per KM</p>
                  <p className="text-lg font-semibold">${result.insights.costAnalysis.costPerKm.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Potential Savings</p>
                  <p className="text-lg font-semibold text-green-600">${result.insights.costAnalysis.savings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.insights.improvementSuggestions.length > 0 ? (
              <div className="space-y-3">
                {result.insights.improvementSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{suggestion.category}</span>
                      <div className="flex gap-2">
                        <Badge 
                          variant={
                            suggestion.priority === 'critical' ? 'destructive' :
                            suggestion.priority === 'high' ? 'default' :
                            suggestion.priority === 'medium' ? 'secondary' : 'outline'
                          }
                        >
                          {suggestion.priority}
                        </Badge>
                        <Badge variant="outline">
                          +{suggestion.expectedImpact}% improvement
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <p className="text-xs text-gray-500">
                      Implementation cost: ${suggestion.implementationCost.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No improvement suggestions available.</p>
            )}
          </CardContent>
        </Card>
      </>
    ) : (
      <Card>
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Insights Yet</h3>
          <p className="text-gray-500">Run an optimization to see AI insights and recommendations.</p>
        </CardContent>
      </Card>
    )}
  </TabsContent>
);
