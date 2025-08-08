// Enhanced Fraud Detection System based on Customs-Fraud-Detection research
// Implements DATE (Deep Attention-based Tree Embedding) model concepts in TypeScript

export interface FraudFeatures {
  // Basic declaration features
  unitPrice: number;
  totalValue: number;
  quantity: number;
  weight?: number;
  
  // Categorical features
  hsCode: string;
  countryOfOrigin: string;
  portOfEntry: string;
  importerCode: string;
  exporterCode: string;
  
  // Temporal features
  declarationDate: string;
  seasonality: number; // 1-4 for quarters
  dayOfWeek: number; // 1-7
  
  // Risk indicators
  priceDeviation: number; // Deviation from market price
  volumeAnomaly: number; // Unusual volume for this trader
  frequencyScore: number; // Trading frequency score
  
  // Network features
  traderRiskScore: number;
  countryRiskScore: number;
  productRiskScore: number;
}

export interface AttentionWeights {
  temporal: number;
  categorical: number;
  numerical: number;
  network: number;
}

export interface FraudPrediction {
  fraudProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  attentionWeights: AttentionWeights;
  anomalyScores: {
    price: number;
    volume: number;
    pattern: number;
    network: number;
  };
  explanations: string[];
  recommendations: string[];
}

export class EnhancedFraudDetectionModel {
  private modelWeights: { [key: string]: number };
  private attentionHeads: number = 4;
  private hiddenDim: number = 16;
  private learningRate: number = 0.005;
  private l2Reg: number = 0.01;
  private alpha: number = 10; // Regression loss weight
  
  // Market price database for price deviation calculation
  private marketPrices: { [hsCode: string]: { mean: number; std: number } };
  
  // Risk scoring databases
  private traderRiskDB: { [importerCode: string]: number };
  private countryRiskDB: { [country: string]: number };
  private productRiskDB: { [hsCode: string]: number };
  
  constructor() {
    this.initializeModel();
    this.initializeRiskDatabases();
  }

  private initializeModel(): void {
    // Initialize model weights based on DATE architecture
    this.modelWeights = {
      // Attention weights for different feature types
      'attention_temporal': 0.25,
      'attention_categorical': 0.30,
      'attention_numerical': 0.35,
      'attention_network': 0.10,
      
      // Feature importance weights
      'price_deviation': 0.28,
      'volume_anomaly': 0.22,
      'trader_risk': 0.18,
      'country_risk': 0.15,
      'product_risk': 0.12,
      'frequency_score': 0.05
    };
  }

  private initializeRiskDatabases(): void {
    // Initialize market prices for common HS codes
    this.marketPrices = {
      '8703.23.00': { mean: 15000, std: 5000 }, // Motor cars
      '6203.42.40': { mean: 25, std: 10 },      // Cotton trousers
      '8517.12.00': { mean: 300, std: 150 },    // Mobile phones
      '0901.21.00': { mean: 8, std: 3 },        // Coffee
      '7108.13.50': { mean: 45000, std: 10000 }, // Gold
      '8471.30.00': { mean: 800, std: 400 },    // Computers
      '6204.62.40': { mean: 30, std: 12 },      // Women's trousers
      '9403.60.80': { mean: 200, std: 80 },     // Furniture
      '8528.72.64': { mean: 400, std: 200 },    // TV receivers
      '6110.20.20': { mean: 35, std: 15 }       // Sweaters
    };

    // Initialize trader risk scores (higher = more risky)
    this.traderRiskDB = {
      'HIGH_RISK_TRADER_001': 0.85,
      'HIGH_RISK_TRADER_002': 0.78,
      'MEDIUM_RISK_TRADER_001': 0.45,
      'MEDIUM_RISK_TRADER_002': 0.52,
      'LOW_RISK_TRADER_001': 0.15,
      'LOW_RISK_TRADER_002': 0.22
    };

    // Initialize country risk scores
    this.countryRiskDB = {
      'China': 0.35,
      'Vietnam': 0.20,
      'Thailand': 0.25,
      'Malaysia': 0.22,
      'Singapore': 0.15,
      'South Korea': 0.18,
      'Japan': 0.12,
      'Germany': 0.10,
      'United States': 0.08,
      'Unknown': 0.90
    };

    // Initialize product risk scores by HS code
    this.productRiskDB = {
      '8703.23.00': 0.40, // Motor cars - high value, common fraud
      '7108.13.50': 0.85, // Gold - very high risk
      '8517.12.00': 0.55, // Mobile phones - medium-high risk
      '6203.42.40': 0.30, // Textiles - medium risk
      '0901.21.00': 0.20, // Coffee - low-medium risk
      '8471.30.00': 0.45, // Computers - medium-high risk
      '6204.62.40': 0.35, // Women's clothing - medium risk
      '9403.60.80': 0.25, // Furniture - low-medium risk
      '8528.72.64': 0.50, // Electronics - medium-high risk
      '6110.20.20': 0.28  // Knitwear - medium risk
    };
  }

  // Calculate price deviation score
  private calculatePriceDeviation(hsCode: string, unitPrice: number): number {
    const marketData = this.marketPrices[hsCode];
    if (!marketData) {
      return 0.5; // Unknown product, medium risk
    }

    const zScore = Math.abs(unitPrice - marketData.mean) / marketData.std;
    
    // Convert z-score to probability (sigmoid-like function)
    const deviation = 1 / (1 + Math.exp(-0.5 * (zScore - 2)));
    
    // Higher deviation for undervaluation (common fraud pattern)
    if (unitPrice < marketData.mean * 0.5) {
      return Math.min(deviation * 1.5, 1.0);
    }
    
    return Math.min(deviation, 1.0);
  }

  // Calculate volume anomaly score
  private calculateVolumeAnomaly(quantity: number, hsCode: string, importerCode: string): number {
    // Typical quantities for different product categories
    const typicalQuantities: { [category: string]: { min: number; max: number } } = {
      'vehicles': { min: 1, max: 50 },
      'electronics': { min: 10, max: 10000 },
      'textiles': { min: 100, max: 50000 },
      'food': { min: 1000, max: 100000 },
      'precious_metals': { min: 1, max: 100 }
    };

    // Determine category from HS code
    let category = 'electronics'; // default
    if (hsCode.startsWith('87')) category = 'vehicles';
    else if (hsCode.startsWith('62') || hsCode.startsWith('61')) category = 'textiles';
    else if (hsCode.startsWith('09')) category = 'food';
    else if (hsCode.startsWith('71')) category = 'precious_metals';

    const typical = typicalQuantities[category];
    
    // Calculate anomaly score
    if (quantity < typical.min || quantity > typical.max * 2) {
      return Math.min(0.8, 0.3 + (Math.abs(quantity - typical.max) / typical.max));
    }
    
    return 0.1; // Normal quantity
  }

  // Calculate frequency score based on trading patterns
  private calculateFrequencyScore(importerCode: string, declarationDate: string): number {
    // Simulate frequency analysis
    // In real implementation, this would query historical data
    const baseFrequency = Math.random() * 0.4; // Base frequency score
    
    // Add seasonal adjustments
    const date = new Date(declarationDate);
    const month = date.getMonth() + 1;
    
    // Higher risk during holiday seasons (potential rush to avoid inspections)
    if (month === 12 || month === 1 || month === 2) {
      return Math.min(baseFrequency + 0.2, 1.0);
    }
    
    return baseFrequency;
  }

  // Multi-head attention mechanism (simplified)
  private calculateAttentionWeights(features: FraudFeatures): AttentionWeights {
    // Simplified attention calculation
    const temporalFeatures = [features.seasonality, features.dayOfWeek];
    const categoricalFeatures = [features.hsCode, features.countryOfOrigin, features.portOfEntry];
    const numericalFeatures = [features.unitPrice, features.totalValue, features.quantity];
    const networkFeatures = [features.traderRiskScore, features.countryRiskScore, features.productRiskScore];

    // Calculate attention scores (simplified softmax)
    const scores = {
      temporal: this.modelWeights['attention_temporal'] * (1 + Math.random() * 0.2),
      categorical: this.modelWeights['attention_categorical'] * (1 + Math.random() * 0.2),
      numerical: this.modelWeights['attention_numerical'] * (1 + Math.random() * 0.2),
      network: this.modelWeights['attention_network'] * (1 + Math.random() * 0.2)
    };

    // Normalize to sum to 1
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    return {
      temporal: scores.temporal / total,
      categorical: scores.categorical / total,
      numerical: scores.numerical / total,
      network: scores.network / total
    };
  }

  // Enhanced fraud prediction with attention mechanism
  public predictFraud(features: FraudFeatures): FraudPrediction {
    // Calculate individual anomaly scores
    const priceDeviation = this.calculatePriceDeviation(features.hsCode, features.unitPrice);
    const volumeAnomaly = this.calculateVolumeAnomaly(features.quantity, features.hsCode, features.importerCode);
    const frequencyScore = this.calculateFrequencyScore(features.importerCode, features.declarationDate);
    
    // Get risk scores from databases
    const traderRisk = this.traderRiskDB[features.importerCode] || 0.5;
    const countryRisk = this.countryRiskDB[features.countryOfOrigin] || 0.5;
    const productRisk = this.productRiskDB[features.hsCode] || 0.5;

    // Calculate attention weights
    const attentionWeights = this.calculateAttentionWeights(features);

    // Calculate anomaly scores
    const anomalyScores = {
      price: priceDeviation,
      volume: volumeAnomaly,
      pattern: frequencyScore,
      network: (traderRisk + countryRisk + productRisk) / 3
    };

    // Weighted fraud probability calculation using attention mechanism
    const fraudProbability = 
      attentionWeights.numerical * (priceDeviation * this.modelWeights['price_deviation'] + 
                                   volumeAnomaly * this.modelWeights['volume_anomaly']) +
      attentionWeights.network * (traderRisk * this.modelWeights['trader_risk'] + 
                                 countryRisk * this.modelWeights['country_risk'] + 
                                 productRisk * this.modelWeights['product_risk']) +
      attentionWeights.temporal * (frequencyScore * this.modelWeights['frequency_score']);

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (fraudProbability < 0.25) riskLevel = 'LOW';
    else if (fraudProbability < 0.50) riskLevel = 'MEDIUM';
    else if (fraudProbability < 0.75) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    // Calculate confidence based on feature consistency
    const confidence = 1 - Math.abs(0.5 - fraudProbability) * 2;

    // Generate explanations
    const explanations = this.generateExplanations(anomalyScores, features);
    const recommendations = this.generateRecommendations(riskLevel, anomalyScores);

    return {
      fraudProbability: Math.min(Math.max(fraudProbability, 0), 1),
      riskLevel,
      confidence,
      attentionWeights,
      anomalyScores,
      explanations,
      recommendations
    };
  }

  private generateExplanations(anomalyScores: any, features: FraudFeatures): string[] {
    const explanations: string[] = [];

    if (anomalyScores.price > 0.6) {
      explanations.push(`Price deviation detected: Unit price significantly differs from market average`);
    }

    if (anomalyScores.volume > 0.6) {
      explanations.push(`Volume anomaly: Quantity is unusual for this product category`);
    }

    if (anomalyScores.pattern > 0.6) {
      explanations.push(`Trading pattern anomaly: Unusual frequency or timing of declarations`);
    }

    if (anomalyScores.network > 0.6) {
      explanations.push(`Network risk: High-risk trader, country, or product combination`);
    }

    if (explanations.length === 0) {
      explanations.push('No significant anomalies detected in this declaration');
    }

    return explanations;
  }

  private generateRecommendations(riskLevel: string, anomalyScores: any): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'CRITICAL':
        recommendations.push('Immediate manual inspection required');
        recommendations.push('Verify all supporting documents');
        recommendations.push('Contact importer for additional information');
        recommendations.push('Consider physical examination of goods');
        break;
      
      case 'HIGH':
        recommendations.push('Priority inspection recommended');
        recommendations.push('Verify market prices and product specifications');
        recommendations.push('Review trader history and compliance record');
        break;
      
      case 'MEDIUM':
        recommendations.push('Standard inspection procedures');
        recommendations.push('Document review recommended');
        recommendations.push('Monitor for pattern development');
        break;
      
      case 'LOW':
        recommendations.push('Standard processing');
        recommendations.push('Routine compliance check');
        break;
    }

    if (anomalyScores.price > 0.7) {
      recommendations.push('Verify current market prices for similar products');
    }

    if (anomalyScores.volume > 0.7) {
      recommendations.push('Confirm business capacity and storage facilities');
    }

    return recommendations;
  }

  // Batch prediction for multiple declarations
  public batchPredict(declarationsList: FraudFeatures[]): FraudPrediction[] {
    return declarationsList.map(features => this.predictFraud(features));
  }

  // Model training simulation (for demonstration)
  public trainModel(trainingData: { features: FraudFeatures; label: boolean }[]): {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  } {
    // Simulate training process
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    trainingData.forEach(({ features, label }) => {
      const prediction = this.predictFraud(features);
      const predicted = prediction.fraudProbability > 0.5;

      if (predicted && label) truePositives++;
      else if (predicted && !label) falsePositives++;
      else if (!predicted && !label) trueNegatives++;
      else if (!predicted && label) falseNegatives++;
    });

    const accuracy = (truePositives + trueNegatives) / trainingData.length;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    return { accuracy, precision, recall, f1Score };
  }

  // Update model weights based on feedback
  public updateWeights(feedback: { features: FraudFeatures; actualLabel: boolean; predictedLabel: boolean }[]): void {
    // Simplified weight update mechanism
    feedback.forEach(({ features, actualLabel, predictedLabel }) => {
      if (actualLabel !== predictedLabel) {
        // Adjust weights based on error
        const adjustment = 0.01; // Learning rate
        
        if (actualLabel && !predictedLabel) {
          // False negative - increase sensitivity
          this.modelWeights['price_deviation'] += adjustment;
          this.modelWeights['volume_anomaly'] += adjustment;
        } else if (!actualLabel && predictedLabel) {
          // False positive - decrease sensitivity
          this.modelWeights['price_deviation'] -= adjustment;
          this.modelWeights['volume_anomaly'] -= adjustment;
        }
      }
    });

    // Ensure weights stay within bounds
    Object.keys(this.modelWeights).forEach(key => {
      this.modelWeights[key] = Math.max(0.01, Math.min(1.0, this.modelWeights[key]));
    });
  }
}

export default EnhancedFraudDetectionModel;
