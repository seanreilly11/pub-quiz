'use client';

import { Search } from 'lucide-react';

interface Props {
  value: string;
  onChange: (q: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-ink border border-line rounded-lg px-3 py-1.5 min-w-[200px]">
      <Search size={13} className="text-chalk-dim flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Pub name or area…"
        aria-label="Search pubs"
        className="bg-transparent border-none outline-none text-chalk text-[13px] font-body placeholder:text-chalk-dim w-full"
      />
    </div>
  );
}
