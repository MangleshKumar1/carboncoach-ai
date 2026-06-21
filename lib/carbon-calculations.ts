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
 * Calculates the annual transport emissions in kg CO₂ based on weekly distance and vehicle mode.
 * Formula: kmPerWeek * 52 weeks * emission_factor
 *
 * @param kmPerWeek - The average distance traveled per week in kilometers.
 * @param mode - The vehicle mode of transport ('car', 'bus', 'train').
 * @returns The calculated annual emissions in kg CO₂.
 * @throws {Error} If kmPerWeek is negative.
 */
export function calculateTransportEmissions(
  kmPerWeek: number,
  mode: TransportMode
): number {
  if (kmPerWeek < 0) throw new Error('Kilometers per week cannot be negative');
  return Math.round(kmPerWeek * 52 * TRANSPORT_FACTORS[mode] * 100) / 100;
}

/**
 * Calculates the annual electricity emissions in kg CO₂ based on monthly electricity consumption in units (kWh).
 * Formula: unitsPerMonth * 12 months * 0.82 kg CO₂/unit (India grid factor)
 *
 * @param unitsPerMonth - The average electricity consumption per month in kWh.
 * @returns The calculated annual emissions in kg CO₂.
 * @throws {Error} If unitsPerMonth is negative.
 */
export function calculateElectricityEmissions(unitsPerMonth: number): number {
  if (unitsPerMonth < 0) throw new Error('Electricity units cannot be negative');
  return Math.round(unitsPerMonth * 12 * ELECTRICITY_FACTOR * 100) / 100;
}

/**
 * Calculates the annual diet-related emissions in kg CO₂ based on food style.
 * Fixed coefficients: vegan: 1500, vegetarian: 2500, non-veg: 4500.
 *
 * @param foodType - The diet style ('vegan', 'vegetarian', 'non-veg').
 * @returns The annual diet-related emissions in kg CO₂.
 */
export function calculateFoodEmissions(foodType: FoodType): number {
  return FOOD_EMISSIONS[foodType];
}

/**
 * Calculates the annual aviation emissions in kg CO₂ based on the number of flights.
 * Formula: flightsPerYear * 255 kg CO₂/flight
 *
 * @param flightsPerYear - The number of flights taken per year.
 * @returns The calculated annual emissions in kg CO₂.
 * @throws {Error} If flightsPerYear is negative.
 */
export function calculateFlightEmissions(flightsPerYear: number): number {
  if (flightsPerYear < 0) throw new Error('Flights per year cannot be negative');
  return Math.round(flightsPerYear * FLIGHT_FACTOR * 100) / 100;
}

/**
 * Calculates the annual shopping emissions in kg CO₂ based on monthly spend.
 * Formula: spendPerMonth * 12 months * 0.0025 kg CO₂/rupee (2.5 kg per ₹1,000 spent)
 *
 * @param spendPerMonth - The average monthly shopping spend in rupees.
 * @returns The calculated annual emissions in kg CO₂.
 * @throws {Error} If spendPerMonth is negative.
 */
export function calculateShoppingEmissions(spendPerMonth: number): number {
  if (spendPerMonth < 0) throw new Error('Shopping spend cannot be negative');
  return Math.round(spendPerMonth * 12 * SHOPPING_FACTOR * 100) / 100;
}

/**
 * Categorizes the annual carbon emissions into 'low', 'medium', or 'high' impact classes.
 * Thresholds:
 * - 'low': Under 2,000 kg CO₂/year
 * - 'medium': 2,000–5,000 kg CO₂/year
 * - 'high': Above 5,000 kg CO₂/year
 *
 * @param totalKgPerYear - The total annual carbon footprint in kg CO₂.
 * @returns The categorized CarbonCategory ('low' | 'medium' | 'high').
 */
export function getCarbonCategory(totalKgPerYear: number): CarbonCategory {
  if (totalKgPerYear < 2000) return 'low';
  if (totalKgPerYear <= 5000) return 'medium';
  return 'high';
}

/**
 * Computes the complete annual carbon footprint metrics (total, breakdown, category, monthly average, comparison to national average) from all user inputs.
 *
 * @param input - The structured CarbonInput domain object containing user transport, diet, energy, flight, and spend inputs.
 * @returns The computed CarbonResult object containing the full analysis.
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
 * Validates the partial carbon inputs to ensure no fields contain negative values.
 *
 * @param input - The partial CarbonInput configuration object to validate.
 * @returns An array of string validation error messages (empty if all values are valid).
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
