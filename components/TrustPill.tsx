import type { VerificationSource } from '@/lib/types';

interface Props {
  source: VerificationSource;
  date: string;
}

export default function TrustPill({ source, date }: Props) {
  const isConfirmed = source === 'pub';

  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-[0.3px] border whitespace-nowrap',
        isConfirmed
          ? 'bg-confirmed/15 border-confirmed text-confirmed'
          : 'bg-website/10 border-dashed border-website text-website',
      ].join(' ')}
    >
      <span
        className={[
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          isConfirmed ? 'bg-confirmed' : 'bg-website',
        ].join(' ')}
        aria-hidden="true"
      />
      {isConfirmed ? `Checked with pub · ${date}` : `From pub's site · ${date}`}
    </span>
  );
}
