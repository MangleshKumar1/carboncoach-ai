'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { TransportMode, FoodType, CarbonInput } from '@/types/carbon';
import { calculateTotalEmissions, validateCarbonInput } from '@/lib/carbon-calculations';
import { saveCarbonInput, saveCarbonResult, addCarbonHistoryEntry } from '@/lib/storage';

const TRANSPORT_MODES: { value: TransportMode; label: string; icon: string; desc: string }[] = [
  { value: 'car', label: 'Car', icon: '🚗', desc: '0.21 kg CO₂/km' },
  { value: 'bus', label: 'Bus', icon: '🚌', desc: '0.089 kg CO₂/km' },
  { value: 'train', label: 'Train', icon: '🚆', desc: '0.041 kg CO₂/km' },
];

const FOOD_TYPES: { value: FoodType; label: string; icon: string; desc: string }[] = [
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: '~1.5 tons/yr' },
  { value: 'vegetarian', label: 'Vegetarian', icon: '🥗', desc: '~2.5 tons/yr' },
  { value: 'non-veg', label: 'Non-Veg', icon: '🍖', desc: '~4.5 tons/yr' },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [transportMode, setTransportMode] = useState<TransportMode>('car');
  const [transportKm, setTransportKm] = useState('');
  const [electricityUnits, setElectricityUnits] = useState('');
  const [foodType, setFoodType] = useState<FoodType>('vegetarian');
  const [flights, setFlights] = useState('');
  const [shoppingSpend, setShoppingSpend] = useState('');

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    const km = parseFloat(transportKm);
    const elec = parseFloat(electricityUnits);
    const fl = parseFloat(flights);
    const shop = parseFloat(shoppingSpend);

    if (!transportKm || isNaN(km)) newErrors.transportKm = 'Please enter a valid number';
    else if (km < 0) newErrors.transportKm = 'Cannot be negative';

    if (!electricityUnits || isNaN(elec)) newErrors.electricityUnits = 'Please enter a valid number';
    else if (elec < 0) newErrors.electricityUnits = 'Cannot be negative';

    if (!flights || isNaN(fl)) newErrors.flights = 'Please enter a valid number';
    else if (fl < 0) newErrors.flights = 'Cannot be negative';

    if (!shoppingSpend || isNaN(shop)) newErrors.shoppingSpend = 'Please enter a valid number';
    else if (shop < 0) newErrors.shoppingSpend = 'Cannot be negative';

    const carbonInput: Partial<CarbonInput> = {
      transportKmPerWeek: km,
      electricityUnitsPerMonth: elec,
      flightsPerYear: fl,
      shoppingSpendPerMonth: shop,
    };
    const validationErrors = validateCarbonInput(carbonInput);
    validationErrors.forEach((err) => {
      if (err.includes('Transport')) newErrors.transportKm = err;
      if (err.includes('Electricity')) newErrors.electricityUnits = err;
      if (err.includes('flights')) newErrors.flights = err;
      if (err.includes('Shopping')) newErrors.shoppingSpend = err;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const input: CarbonInput = {
      transportMode,
      transportKmPerWeek: parseFloat(transportKm),
      electricityUnitsPerMonth: parseFloat(electricityUnits),
      foodType,
      flightsPerYear: parseFloat(flights),
      shoppingSpendPerMonth: parseFloat(shoppingSpend),
    };

    const result = calculateTotalEmissions(input);
    saveCarbonInput(input);
    saveCarbonResult(result);
    addCarbonHistoryEntry(result.totalKgPerYear, result.breakdown);

    // Brief delay for visual feedback
    setTimeout(() => {
      router.push('/dashboard');
    }, 600);
  }

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="animate-fade-in-up mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            🧮 Carbon Calculator
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
            Calculate Your <span className="gradient-text">Carbon Footprint</span>
          </h1>
          <p className="text-slate-400">
            Answer a few questions about your lifestyle to estimate your annual CO₂ emissions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-8" style={{ animationDelay: '0.15s' }}>
          {/* ── Transport ── */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              🚗 Transport
            </h2>

            {/* Mode selector */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">Primary mode of transport</label>
              <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Select transport mode">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    role="radio"
                    aria-checked={transportMode === mode.value}
                    aria-label={`Select ${mode.label} as transport mode`}
                    onClick={() => setTransportMode(mode.value)}
                    className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                      transportMode === mode.value
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 bg-slate-800/30 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{mode.icon}</span>
                    <span className="text-sm font-medium block">{mode.label}</span>
                    <span className="text-[10px] block text-slate-500">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="Distance traveled per week"
              icon="📏"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 50"
              value={transportKm}
              onChange={(e) => setTransportKm(e.target.value)}
              error={errors.transportKm}
              helperText="In kilometers — include commute and errands"
            />
          </div>

          {/* ── Electricity ── */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              ⚡ Electricity
            </h2>
            <InputField
              label="Monthly electricity consumption"
              icon="🔌"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 200"
              value={electricityUnits}
              onChange={(e) => setElectricityUnits(e.target.value)}
              error={errors.electricityUnits}
              helperText="Check your electricity bill for monthly units (kWh)"
            />
          </div>

          {/* ── Food ── */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              🍽️ Food
            </h2>
            <label className="mb-2 block text-sm font-medium text-slate-300">Dietary preference</label>
            <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Select food type">
              {FOOD_TYPES.map((food) => (
                <button
                  key={food.value}
                  type="button"
                  role="radio"
                  aria-checked={foodType === food.value}
                  aria-label={`Select ${food.label} diet`}
                  onClick={() => setFoodType(food.value)}
                  className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                    foodType === food.value
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 bg-slate-800/30 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl block mb-1">{food.icon}</span>
                  <span className="text-sm font-medium block">{food.label}</span>
                  <span className="text-[10px] block text-slate-500">{food.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Flights ── */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              ✈️ Flights
            </h2>
            <InputField
              label="Number of flights per year"
              icon="🛫"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 4"
              value={flights}
              onChange={(e) => setFlights(e.target.value)}
              error={errors.flights}
              helperText="Count round trips as 2 flights"
            />
          </div>

          {/* ── Shopping ── */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              🛍️ Shopping
            </h2>
            <InputField
              label="Monthly shopping spend"
              icon="₹"
              type="number"
              min="0"
              step="100"
              placeholder="e.g., 5000"
              value={shoppingSpend}
              onChange={(e) => setShoppingSpend(e.target.value)}
              error={errors.shoppingSpend}
              helperText="Non-food purchases — clothes, gadgets, household items (₹)"
            />
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={saving}
            aria-label="Calculate my carbon footprint"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-3">
                <LoadingSpinner size="sm" />
                Calculating...
              </span>
            ) : (
              '🌱 Calculate My Footprint →'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
