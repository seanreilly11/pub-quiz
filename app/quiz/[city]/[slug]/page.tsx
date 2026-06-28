import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import ListingDetailStatic from '@/components/ListingDetailStatic';
import { getVenueBySlug, getVenues } from '@/lib/data';
import { distanceMilesFromUser } from '@/lib/geo';

interface Params { city: string; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city, slug } = await params;
  const venue = getVenueBySlug(city, slug);
  if (!venue) return {};
  return {
    title: `${venue.name} — Quiz Night in ${venue.area}, ${venue.city} | Round Two`,
    description: `${venue.name} runs a pub quiz every ${venue.day} at ${venue.startTime} in ${venue.area}. ${venue.generalNotes}`,
  };
}

export function generateStaticParams(): Params[] {
  return getVenues().map(v => ({ city: v.city.toLowerCase(), slug: v.slug }));
}

export default async function ListingPage({ params }: { params: Promise<Params> }) {
  const { city, slug } = await params;
  const venue = getVenueBySlug(city, slug);
  if (!venue) notFound();

  const distanceMiles = distanceMilesFromUser(venue.lat, venue.lng);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
        <a href="/" className="text-[12px] text-chalk-dim hover:text-chalk mb-4 inline-block transition-colors">
          ← All quizzes
        </a>
        <ListingDetailStatic venue={venue} distanceMiles={distanceMiles} />
      </main>
    </div>
  );
}
