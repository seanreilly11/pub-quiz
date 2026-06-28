'use client';

import DistanceSlider from './DistanceSlider';
import SearchBox from './SearchBox';

interface Props {
  within: number;
  q: string;
  onWithinChange: (miles: number) => void;
  onQChange: (q: string) => void;
  onClose: () => void;
}

export default function FilterSheet({ within, q, onWithinChange, onQChange, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative bg-bottle border-t border-line rounded-t-2xl p-5 flex flex-col gap-5">
        <div className="w-8 h-1 bg-line rounded-full mx-auto" />
        <div>
          <p className="font-display text-[10px] tracking-[1.5px] uppercase text-chalk-dim mb-2">
            Within
          </p>
          <DistanceSlider value={within} onChange={onWithinChange} />
        </div>
        <div>
          <p className="font-display text-[10px] tracking-[1.5px] uppercase text-chalk-dim mb-2">
            Search
          </p>
          <SearchBox value={q} onChange={onQChange} />
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-brass text-ink font-semibold rounded-lg"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
