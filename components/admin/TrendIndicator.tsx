'use client';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  showArrow?: boolean;
}

export default function TrendIndicator({ value, label, showArrow = true }: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
  const bgClass = isPositive ? 'bg-green-50' : 'bg-red-50';
  const arrow = isPositive ? '↑' : '↓';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${bgClass} ${colorClass}`}>
      {showArrow && <span className="text-xs font-bold">{arrow}</span>}
      <span className="text-xs font-semibold">{Math.abs(value).toFixed(1)}%</span>
      {label && <span className="text-xs text-gray-600 ml-1">{label}</span>}
    </div>
  );
}

