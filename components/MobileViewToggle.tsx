'use client';

type View = 'map' | 'list';

interface Props {
  value: View;
  onChange: (v: View) => void;
}

export default function MobileViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex border-b border-line bg-bottle md:hidden flex-shrink-0">
      {(['map', 'list'] as const).map(v => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={[
            'flex-1 py-2 text-[12px] font-semibold text-center capitalize border-b-2 transition-colors',
            value === v
              ? 'text-brass border-brass'
              : 'text-chalk-dim border-transparent',
          ].join(' ')}
        >
          {v === 'map' ? 'Map' : 'List'}
        </button>
      ))}
    </div>
  );
}
