interface Props {
  className?: string;
}

export default function Legend({ className = '' }: Props) {
  return (
    <div
      className={[
        'absolute top-3 left-3 bg-bottle/90 backdrop-blur-sm border border-line rounded-lg px-3.5 py-2.5 flex flex-col gap-1.5',
        className,
      ].join(' ')}
    >
      {[
        { color: 'bg-confirmed', shape: 'rounded-full', label: 'Checked with pub' },
        { color: 'bg-website', shape: 'rounded-sm', label: 'From their website' },
      ].map(({ color, shape, label }) => (
        <div key={label} className="flex items-center gap-2 text-[11px] text-chalk-dim">
          <div className={`w-2.5 h-2.5 ${shape} ${color}`} aria-hidden="true" />
          {label}
        </div>
      ))}
    </div>
  );
}
