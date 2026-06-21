import {
  TransportMode,
  FoodType,
  CarbonInput,
  CarbonBreakdown,
  CarbonResult,
  CarbonCategory,
} from '@/types/carbon';

// ── Emission Factors ──

const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  car: 0.21,    // kg CO2 per km
  bus: 0.089,   // kg CO2 per km
  train: 0.041, // kg CO2 per km
};

const ELECTRICITY_FACTOR = 0.82; // kg CO2 per unit (India grid)

const FOOD_EMISSIONS: Record<FoodType, number> = {
  vegan: 1500,       // kg CO2 per year
  vegetarian: 2500,  // kg CO2 per year
  'non-veg': 4500,   // kg CO2 per year
};

const FLIGHT_FACTOR = 255; // kg CO2 per flight (0.255 tons)

// Correction: The shopping factor was 2.5 kg CO2/rupee, which is off by a factor of 1000.
// Spending 1 rupee does not emit 2.5 kg CO2 (equivalent to burning a liter of fuel).
// The factor of 0.0025 tons CO2 (2.5 kg) is per 1000 rupees of spending.
// Therefore, the per-rupee factor is 0.0025 kg CO2 per rupee.
const SHOPPING_FACTOR = 0.0025; // kg CO2 per rupee

const INDIA_AVG_KG_PER_YEAR = 1900; // 1.9 tons

// ── Calculation Functions ──

/**
 * Calculate annual transport emissions in kg CO2
 * Formula: km_per_week * 52 weeks * emission_factor
 */
export function calculateTransportEmissions(
  kmPerWeek: number,
  mode: TransportMode
): number {
  if (kmPerWeek < 0) throw new Error('Kilometers per week cannot be negative');
  return Math.round(kmPerWeek * 52 * TRANSPORT_FACTORS[mode] * 100) / 100;
}

/**
 * Calculate annual electricity emissions in kg CO2
 * Formula: units_per_month * 12 * 0.82
 */
export function calculateElectricityEmissions(unitsPerMonth: number): number {
  if (unitsPerMonth < 0) throw new Error('Electricity units cannot be negative');
  return Math.round(unitsPerMonth * 12 * ELECTRICITY_FACTOR * 100) / 100;
}

/**
 * Calculate annual food emissions in kg CO2
 */
export function calculateFoodEmissions(foodType: FoodType): number {
  return FOOD_EMISSIONS[foodType];
}

/**
 * Calculate annual flight emissions in kg CO2
 * Formula: flights_per_year * 255 kg
 */
export function calculateFlightEmissions(flightsPerYear: number): number {
  if (flightsPerYear < 0) throw new Error('Flights per year cannot be negative');
  return Math.round(flightsPerYear * FLIGHT_FACTOR * 100) / 100;
}

/**
 * Calculate annual shopping emissions in kg CO2
 * Formula: spend_per_month * 12 * 2.5 kg
 */
export function calculateShoppingEmissions(spendPerMonth: number): number {
  if (spendPerMonth < 0) throw new Error('Shopping spend cannot be negative');
  return Math.round(spendPerMonth * 12 * SHOPPING_FACTOR * 100) / 100;
}

/**
 * Determine carbon category based on total annual kg CO2
 */
export function getCarbonCategory(totalKgPerYear: number): CarbonCategory {
  if (totalKgPerYear < 2000) return 'low';
  if (totalKgPerYear <= 5000) return 'medium';
  return 'high';
}

/**
 * Calculate complete carbon footprint from all inputs
 */
export function calculateTotalEmissions(input: CarbonInput): CarbonResult {
  const breakdown: CarbonBreakdown = {
    transport: calculateTransportEmissions(input.transportKmPerWeek, input.transportMode),
    electricity: calculateElectricityEmissions(input.electricityUnitsPerMonth),
    food: calculateFoodEmissions(input.foodType),
    flights: calculateFlightEmissions(input.flightsPerYear),
    shopping: calculateShoppingEmissions(input.shoppingSpendPerMonth),
  };

  const totalKgPerYear =
    breakdown.transport +
    breakdown.electricity +
    breakdown.food +
    breakdown.flights +
    breakdown.shopping;

  const category = getCarbonCategory(totalKgPerYear);
  const monthlyKg = Math.round((totalKgPerYear / 12) * 100) / 100;
  const comparisonToIndiaAvg =
    Math.round(((totalKgPerYear - INDIA_AVG_KG_PER_YEAR) / INDIA_AVG_KG_PER_YEAR) * 10000) / 100;

  return {
    totalKgPerYear: Math.round(totalKgPerYear * 100) / 100,
    breakdown,
    category,
    monthlyKg,
    comparisonToIndiaAvg,
  };
}

/**
 * Validate carbon input fields
 */
export function validateCarbonInput(input: Partial<CarbonInput>): string[] {
  const errors: string[] = [];

  if (input.transportKmPerWeek !== undefined && input.transportKmPerWeek < 0) {
    errors.push('Transport distance cannot be negative');
  }
  if (input.electricityUnitsPerMonth !== undefined && input.electricityUnitsPerMonth < 0) {
    errors.push('Electricity units cannot be negative');
  }
  if (input.flightsPerYear !== undefined && input.flightsPerYear < 0) {
    errors.push('Number of flights cannot be negative');
  }
  if (input.shoppingSpendPerMonth !== undefined && input.shoppingSpendPerMonth < 0) {
    errors.push('Shopping spend cannot be negative');
  }

  return errors;
}
