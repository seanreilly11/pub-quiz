import type { TriviaVenue, FilterState } from './types';
import { distanceMilesFromUser } from './geo';

export type VenueWithDistance = TriviaVenue & { _distanceMiles: number };

const RAW_VENUES: TriviaVenue[] = [
  {
    id: '1', slug: 'foxed-badger', name: 'The Foxed Badger',
    area: 'Shoreditch', city: 'London', lat: 51.5220, lng: -0.0780,
    day: 'tue', startTime: '8:00pm', frequency: 'Weekly',
    entryFeeRaw: '£2 per person', bookingRequired: false, host: 'In-house',
    generalNotes: 'Classic 6-round format — picture, music, general knowledge. Prize is a tab. Tables of up to 6.',
    websiteUrl: 'https://foxedbadger.co.uk',
    verification: { source: 'pub', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '12 Jun' },
  },
  {
    id: '2', slug: 'anchor-compass', name: 'Anchor & Compass',
    area: 'London Bridge', city: 'London', lat: 51.5045, lng: -0.0865,
    day: 'wed', startTime: '7:30pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'In-house',
    generalNotes: 'Waterfront quiz with Thames views. 5 rounds, team of up to 8.',
    websiteUrl: 'https://anchorcompass.co.uk',
    verification: { source: 'website', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '' },
  },
  {
    id: '3', slug: 'tipsy-vicar', name: 'The Tipsy Vicar',
    area: 'Clerkenwell', city: 'London', lat: 51.5220, lng: -0.1050,
    day: 'mon', startTime: '8:30pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: true, host: 'QuizMasters Co.',
    generalNotes: 'Clerkenwell institution. Booking recommended — fills fast.',
    websiteUrl: 'https://tipsyvicar.co.uk',
    verification: { source: 'pub', foundDate: '10 Mar', emailDate: '12 Mar', confirmedDate: '1 Jun' },
  },
  {
    id: '4', slug: 'brunels-arms', name: "Brunel's Arms",
    area: 'Bermondsey', city: 'London', lat: 51.4985, lng: -0.0807,
    day: 'thu', startTime: '8:00pm', frequency: 'Weekly',
    entryFeeRaw: '£1 per person', bookingRequired: false, host: 'In-house',
    generalNotes: 'South London staple. 7 rounds, picture round included.',
    websiteUrl: 'https://brunelsarms.co.uk',
    verification: { source: 'pub', foundDate: '1 Mar', emailDate: '3 Mar', confirmedDate: '15 May' },
  },
  {
    id: '5', slug: 'the-hopful', name: 'The Hopful',
    area: 'Islington', city: 'London', lat: 51.5362, lng: -0.1033,
    day: 'sun', startTime: '7:00pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'In-house',
    generalNotes: 'Sunday session on Upper Street. Craft beer and tough questions.',
    foodDrinkDeals: 'Burger + pint deal available before the quiz.',
    websiteUrl: 'https://thehopful.co.uk',
    verification: { source: 'website', foundDate: '10 Mar', emailDate: '12 Mar', confirmedDate: '' },
  },
  {
    id: '6', slug: 'quill-quaver', name: 'Quill & Quaver',
    area: 'City of London', city: 'London', lat: 51.5160, lng: -0.0930,
    day: 'wed', startTime: '8:00pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'In-house',
    generalNotes: 'Historic City pub. Music round is legendary.',
    websiteUrl: 'https://quillandquaver.co.uk',
    verification: { source: 'pub', foundDate: '15 Mar', emailDate: '17 Mar', confirmedDate: '8 Jun' },
  },
  {
    id: '7', slug: 'salty-parrot', name: 'The Salty Parrot',
    area: 'Southwark', city: 'London', lat: 51.5025, lng: -0.1020,
    day: 'thu', startTime: '9:00pm', frequency: 'Fortnightly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'QuizMasters Co.',
    generalNotes: 'Late-night fortnightly in Southwark.',
    websiteUrl: 'https://saltypubs.co.uk/parrot',
    verification: { source: 'website', foundDate: '20 Mar', emailDate: '22 Mar', confirmedDate: '' },
  },
  {
    id: '8', slug: 'wickham-tavern', name: 'Wickham Tavern',
    area: 'Bethnal Green', city: 'London', lat: 51.5268, lng: -0.0563,
    day: 'tue', startTime: '7:45pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'In-house',
    generalNotes: 'East London community quiz. Great atmosphere.',
    websiteUrl: 'https://wickhamtavern.co.uk',
    verification: { source: 'pub', foundDate: '5 Apr', emailDate: '7 Apr', confirmedDate: '20 May' },
  },
  {
    id: '9', slug: 'bell-whistle', name: 'The Bell & Whistle',
    area: 'Hoxton', city: 'London', lat: 51.5311, lng: -0.0817,
    day: 'fri', startTime: '8:00pm', frequency: 'Weekly',
    entryFeeRaw: 'Free entry', bookingRequired: false, host: 'In-house',
    generalNotes: 'Friday night favourite in Hoxton. Teams of up to 6.',
    websiteUrl: 'https://bellandwhistle.co.uk',
    verification: { source: 'website', foundDate: '12 Apr', emailDate: '14 Apr', confirmedDate: '' },
  },
];

function withDistance(venues: TriviaVenue[]): VenueWithDistance[] {
  return venues
    .map(v => ({ ...v, _distanceMiles: distanceMilesFromUser(v.lat, v.lng) }))
    .sort((a, b) => a._distanceMiles - b._distanceMiles);
}

export function getVenues(filters: Partial<FilterState> = {}): VenueWithDistance[] {
  const { day = 'any', within = 3, q = '' } = filters;
  const lower = q.toLowerCase();

  return withDistance(
    RAW_VENUES.filter(v => {
      if (day !== 'any' && v.day !== day) return false;
      if (q && !v.name.toLowerCase().includes(lower) && !v.area.toLowerCase().includes(lower)) return false;
      return true;
    })
  ).filter(v => v._distanceMiles <= within);
}

export function getVenueBySlug(city: string, slug: string): TriviaVenue | undefined {
  return RAW_VENUES.find(
    v => v.city.toLowerCase() === city.toLowerCase() && v.slug === slug
  );
}
