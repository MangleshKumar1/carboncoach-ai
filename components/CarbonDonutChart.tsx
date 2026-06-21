'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CarbonBreakdown } from '@/types/carbon';

interface CarbonDonutChartProps {
  breakdown: CarbonBreakdown;
  totalKg: number;
}

const CATEGORY_CONFIG = [
  { key: 'transport', label: 'Transport', color: '#3B82F6' },
  { key: 'electricity', label: 'Electricity', color: '#F59E0B' },
  { key: 'food', label: 'Food', color: '#10B981' },
  { key: 'flights', label: 'Flights', color: '#8B5CF6' },
  { key: 'shopping', label: 'Shopping', color: '#F97316' },
] as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props as {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  };
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: {
    fill: string;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-white/10 bg-slate-800/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-white">{item.name}</p>
      <p className="text-sm text-slate-300">
        <span className="font-semibold" style={{ color: item.payload.fill }}>
          {item.value.toLocaleString()}
        </span>{' '}
        kg CO₂/year
      </p>
    </div>
  );
}

export default function CarbonDonutChart({ breakdown, totalKg }: CarbonDonutChartProps) {
  const data = CATEGORY_CONFIG.map((cat) => ({
    name: cat.label,
    value: breakdown[cat.key],
    color: cat.color,
  })).filter((d) => d.value > 0);

  return (
    <div className="relative" aria-label={`Carbon footprint breakdown chart. Total: ${totalKg} kg CO2 per year`}>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={120}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={10}
            formatter={(value: string) => <span className="text-sm text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ marginTop: '-24px' }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{totalKg.toLocaleString()}</p>
          <p className="text-xs text-slate-400">kg CO₂/yr</p>
        </div>
      </div>
    </div>
  );
}
