'use client';

import DayChips from './DayChips';
import DistanceSlider from './DistanceSlider';
import SearchBox from './SearchBox';
import type { DayKey } from '@/lib/types';

interface Props {
  day: DayKey | 'any';
  within: number;
  q: string;
  onDayChange: (day: DayKey | 'any') => void;
  onWithinChange: (miles: number) => void;
  onQChange: (q: string) => void;
}

export default function FilterRail({ day, within, q, onDayChange, onWithinChange, onQChange }: Props) {
  return (
    <div className="flex items-center gap-5 flex-1">
      <div className="flex items-center gap-2">
        <span className="font-display text-[10px] tracking-[1.5px] uppercase text-chalk-dim">
          Night
        </span>
        <DayChips value={day} onChange={onDayChange} />
      </div>

      <div className="hidden md:flex items-center gap-2 border-l border-line pl-5">
        <span className="font-display text-[10px] tracking-[1.5px] uppercase text-chalk-dim">
          Within
        </span>
        <DistanceSlider value={within} onChange={onWithinChange} />
      </div>

      <div className="hidden md:flex border-l border-line pl-5">
        <SearchBox value={q} onChange={onQChange} />
      </div>
    </div>
  );
}
