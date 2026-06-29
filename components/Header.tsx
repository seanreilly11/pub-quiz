import Link from 'next/link';
import { Users } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-bottle border-b border-line h-[52px] flex items-center justify-between px-4 md:px-5 flex-shrink-0 z-10">
      <div className="flex items-baseline gap-3">
        <span className="font-display font-bold text-xl tracking-[2px] text-brass uppercase">
          Round Two
        </span>
        <span className="hidden md:inline text-chalk-dim text-sm">
          London pub quiz nights
        </span>
      </div>

      <Link
        href="/meet"
        className="hidden md:flex items-center gap-2 text-chalk-dim text-sm border border-line rounded-md px-3 py-1.5 hover:border-brass hover:text-brass transition-colors"
      >
        <Users size={14} />
        Meet in the middle
      </Link>
    </header>
  );
}
