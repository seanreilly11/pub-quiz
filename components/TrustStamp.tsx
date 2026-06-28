import { CheckCircle, Clock } from 'lucide-react';
import type { Verification } from '@/lib/types';

interface Props {
  verification: Verification;
}

export default function TrustStamp({ verification }: Props) {
  const isConfirmed = verification.source === 'pub';

  return (
    <div
      className={[
        'flex items-center gap-3.5 rounded-xl p-3.5 border',
        isConfirmed
          ? 'bg-confirmed/8 border-confirmed/25'
          : 'bg-website/8 border-dashed border-website/40',
      ].join(' ')}
    >
      <div
        className={[
          'w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 -rotate-6',
          isConfirmed ? 'bg-confirmed' : 'bg-transparent border-2 border-dashed border-website',
        ].join(' ')}
        aria-hidden="true"
      >
        {isConfirmed ? (
          <CheckCircle size={22} className="text-ink" />
        ) : (
          <Clock size={22} className="text-website" />
        )}
      </div>

      <div>
        <h4
          className={[
            'font-display text-[11px] tracking-[1.5px] uppercase font-semibold',
            isConfirmed ? 'text-confirmed' : 'text-website',
          ].join(' ')}
        >
          {isConfirmed ? 'Checked with the pub' : 'From their website'}
        </h4>
        <p className="text-[12px] text-chalk-dim mt-0.5">
          {isConfirmed
            ? `Confirmed by reply · ${verification.confirmedDate}`
            : `Awaiting pub reply · since ${verification.foundDate}`}
        </p>
      </div>
    </div>
  );
}
