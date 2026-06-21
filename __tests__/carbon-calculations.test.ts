import {
  calculateTransportEmissions,
  calculateElectricityEmissions,
  calculateFoodEmissions,
  calculateFlightEmissions,
  calculateShoppingEmissions,
  calculateTotalEmissions,
  getCarbonCategory,
  validateCarbonInput,
} from '@/lib/carbon-calculations';
import { CarbonInput } from '@/types/carbon';

// ── Transport Emissions Tests ──

describe('calculateTransportEmissions', () => {
  test('calculates car emissions correctly', () => {
    // 100 km/week * 52 * 0.21 = 1092
    expect(calculateTransportEmissions(100, 'car')).toBe(1092);
  });

  test('calculates bus emissions correctly', () => {
    // 100 km/week * 52 * 0.089 = 462.8
    expect(calculateTransportEmissions(100, 'bus')).toBe(462.8);
  });

  test('calculates train emissions correctly', () => {
    // 100 km/week * 52 * 0.041 = 213.2
    expect(calculateTransportEmissions(100, 'train')).toBe(213.2);
  });

  test('returns 0 for zero kilometers', () => {
    expect(calculateTransportEmissions(0, 'car')).toBe(0);
    expect(calculateTransportEmissions(0, 'bus')).toBe(0);
    expect(calculateTransportEmissions(0, 'train')).toBe(0);
  });

  test('throws error for negative kilometers', () => {
    expect(() => calculateTransportEmissions(-10, 'car')).toThrow(
      'Kilometers per week cannot be negative'
    );
  });
});

// ── Electricity Emissions Tests ──

describe('calculateElectricityEmissions', () => {
  test('calculates electricity emissions correctly', () => {
    // 200 units/month * 12 * 0.82 = 1968
    expect(calculateElectricityEmissions(200)).toBe(1968);
  });

  test('returns 0 for zero units', () => {
    expect(calculateElectricityEmissions(0)).toBe(0);
  });

  test('throws error for negative units', () => {
    expect(() => calculateElectricityEmissions(-50)).toThrow(
      'Electricity units cannot be negative'
    );
  });
});

// ── Food Emissions Tests ──

describe('calculateFoodEmissions', () => {
  test('returns 1500 kg for vegan diet', () => {
    expect(calculateFoodEmissions('vegan')).toBe(1500);
  });

  test('returns 2500 kg for vegetarian diet', () => {
    expect(calculateFoodEmissions('vegetarian')).toBe(2500);
  });

  test('returns 4500 kg for non-veg diet', () => {
    expect(calculateFoodEmissions('non-veg')).toBe(4500);
  });
});

// ── Flight Emissions Tests ──

describe('calculateFlightEmissions', () => {
  test('calculates flight emissions correctly', () => {
    // 4 flights * 255 = 1020
    expect(calculateFlightEmissions(4)).toBe(1020);
  });

  test('throws error for negative flights', () => {
    expect(() => calculateFlightEmissions(-1)).toThrow(
      'Flights per year cannot be negative'
    );
  });
});

// ── Shopping Emissions Tests ──

describe('calculateShoppingEmissions', () => {
  test('calculates shopping emissions correctly', () => {
    // 5000 * 12 * 0.0025 = 150
    expect(calculateShoppingEmissions(5000)).toBe(150);
  });

  test('throws error for negative spend', () => {
    expect(() => calculateShoppingEmissions(-100)).toThrow(
      'Shopping spend cannot be negative'
    );
  });
});

// ── Carbon Category Tests ──

describe('getCarbonCategory', () => {
  test('returns "low" for emissions under 2000 kg', () => {
    expect(getCarbonCategory(1500)).toBe('low');
    expect(getCarbonCategory(0)).toBe('low');
    expect(getCarbonCategory(1999)).toBe('low');
  });

  test('returns "medium" for emissions between 2000-5000 kg', () => {
    expect(getCarbonCategory(2000)).toBe('medium');
    expect(getCarbonCategory(3500)).toBe('medium');
    expect(getCarbonCategory(5000)).toBe('medium');
  });

  test('returns "high" for emissions above 5000 kg', () => {
    expect(getCarbonCategory(5001)).toBe('high');
    expect(getCarbonCategory(10000)).toBe('high');
  });
});

// ── Input Validation Tests ──

describe('validateCarbonInput', () => {
  test('returns no errors for valid input', () => {
    const input: Partial<CarbonInput> = {
      transportKmPerWeek: 50,
      electricityUnitsPerMonth: 200,
      flightsPerYear: 2,
      shoppingSpendPerMonth: 5000,
    };
    expect(validateCarbonInput(input)).toEqual([]);
  });

  test('returns errors for negative values', () => {
    const input: Partial<CarbonInput> = {
      transportKmPerWeek: -10,
      electricityUnitsPerMonth: -5,
      flightsPerYear: -1,
      shoppingSpendPerMonth: -100,
    };
    const errors = validateCarbonInput(input);
    expect(errors.length).toBe(4);
  });
});

// ── Total Emissions Pipeline Test ──

describe('calculateTotalEmissions', () => {
  test('calculates complete emissions pipeline correctly', () => {
    const input: CarbonInput = {
      transportMode: 'car',
      transportKmPerWeek: 100,
      electricityUnitsPerMonth: 200,
      foodType: 'vegetarian',
      flightsPerYear: 4,
      shoppingSpendPerMonth: 5000,
    };

    const result = calculateTotalEmissions(input);

    // transport: 100 * 52 * 0.21 = 1092
    expect(result.breakdown.transport).toBe(1092);
    // electricity: 200 * 12 * 0.82 = 1968
    expect(result.breakdown.electricity).toBe(1968);
    // food: vegetarian = 2500
    expect(result.breakdown.food).toBe(2500);
    // flights: 4 * 255 = 1020
    expect(result.breakdown.flights).toBe(1020);
    // shopping: 5000 * 12 * 0.0025 = 150
    expect(result.breakdown.shopping).toBe(150);

    // total = 1092 + 1968 + 2500 + 1020 + 150 = 6730
    expect(result.totalKgPerYear).toBe(6730);
    expect(result.category).toBe('high');
    expect(result.monthlyKg).toBeCloseTo(6730 / 12, 1);
    expect(typeof result.comparisonToIndiaAvg).toBe('number');
  });
});
