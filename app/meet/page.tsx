import type { Metadata } from 'next';
import Header from '@/components/Header';
import MeetMode from '@/components/MeetMode';

export const metadata: Metadata = {
  title: 'Meet in the Middle — Round Two',
  description: "Find the fairest pub quiz for your whole group. Drop a pin for each person and we'll find the quiz closest to everyone.",
};

export default function MeetPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="bg-brass/10 border-b border-brass/20 px-4 py-2 flex items-center gap-3 text-[11px] text-brass-soft flex-shrink-0">
        <span className="bg-brass text-ink font-display text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded font-semibold">
          Preview
        </span>
        Drop a pin for each mate and we'll find the fairest quiz for everyone.
      </div>
      <MeetMode />
    </div>
  );
}
