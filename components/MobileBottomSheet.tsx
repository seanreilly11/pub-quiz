'use client';

import { useState } from 'react';

interface Props {
  children: React.ReactNode;
  peekContent?: React.ReactNode;
}

export default function MobileBottomSheet({ children, peekContent }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={[
        'absolute bottom-0 left-0 right-0 bg-bottle rounded-t-2xl border-t border-line transition-all duration-300 md:hidden z-20 flex flex-col',
        expanded ? 'h-[80vh]' : 'h-auto',
      ].join(' ')}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        aria-label={expanded ? 'Collapse venue list' : 'Expand venue list'}
        aria-expanded={expanded}
        className="w-full flex flex-col items-center pt-3 pb-1 flex-shrink-0"
      >
        <div className="w-8 h-1 bg-line rounded-full" />
      </button>

      {expanded ? (
        <div className="flex-1 overflow-y-auto pb-8 px-2">{children}</div>
      ) : (
        <div className="px-3 pb-3">{peekContent}</div>
      )}
    </div>
  );
}
