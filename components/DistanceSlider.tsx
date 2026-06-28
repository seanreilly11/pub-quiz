'use client';

interface Props {
  value: number;
  onChange: (miles: number) => void;
}

export default function DistanceSlider({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0.5}
        max={5}
        step={0.5}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-label="Distance in miles"
        className="w-20 accent-brass"
      />
      <span className="text-xs text-brass font-semibold min-w-[50px]">{value} miles</span>
    </div>
  );
}
