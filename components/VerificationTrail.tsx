import type { Verification } from '@/lib/types';

interface Step {
  title: string;
  sub: string;
  done: boolean;
}

interface Props {
  verification: Verification;
  domain: string;
}

export default function VerificationTrail({ verification, domain }: Props) {
  const isConfirmed = verification.source === 'pub';

  const steps: Step[] = [
    {
      title: 'Found on their website',
      sub: `${verification.foundDate} · scraped from ${domain}`,
      done: true,
    },
    {
      title: 'Emailed the pub',
      sub: `${verification.emailDate} · asked to confirm details`,
      done: true,
    },
    {
      title: isConfirmed ? 'Pub confirmed by reply' : 'Reply pending',
      sub: isConfirmed
        ? `${verification.confirmedDate} · details verified`
        : 'Awaiting confirmation from the pub',
      done: isConfirmed,
    },
  ];

  return (
    <div>
      <p className="font-display text-[10px] tracking-[1.5px] uppercase text-chalk-dim mb-3">
        How we know
      </p>
      <ol className="flex flex-col list-none p-0 m-0">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={[
                  'w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5',
                  step.done ? 'bg-confirmed' : 'bg-chalk-dim/40',
                ].join(' ')}
              />
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-line min-h-5" />
              )}
            </div>
            <div className="pb-4">
              <p className="text-[12px] font-semibold text-chalk">{step.title}</p>
              <p className="text-[11px] text-chalk-dim mt-0.5">{step.sub}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
