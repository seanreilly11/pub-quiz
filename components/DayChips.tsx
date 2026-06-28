'use client';

import type { DayKey } from '@/lib/types';

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Mon' }, { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' }, { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' }, { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

interface Props {
  value: DayKey | 'any';
  onChange: (day: DayKey | 'any') => void;
}

export default function DayChips({ value, onChange }: Props) {
  const chipCls = (active: boolean) =>
    [
      'px-2.5 py-1 rounded-full border text-xs transition-colors cursor-pointer whitespace-nowrap',
      active
        ? 'bg-brass border-brass text-ink font-semibold'
        : 'border-line text-chalk-dim hover:border-brass hover:text-brass',
    ].join(' ');

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
      <button className={chipCls(value === 'any')} onClick={() => onChange('any')}>
        Any
      </button>
      {DAYS.map(({ key, label }) => (
        <button key={key} className={chipCls(value === key)} onClick={() => onChange(key)}>
          {label}
        </button>
      ))}
    </div>
  );
}
