export type VerificationSource = 'pub' | 'website';
export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface Verification {
  source: VerificationSource;
  foundDate: string;
  emailDate: string;
  confirmedDate: string;
}

export interface TriviaVenue {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  day: DayKey;
  startTime: string;
  frequency: string;
  entryFeeRaw: string;
  bookingRequired: boolean;
  host: string;
  generalNotes: string;
  foodDrinkDeals?: string;
  websiteUrl: string;
  verification: Verification;
}

export interface FilterState {
  day: DayKey | 'any';
  within: number;
  q: string;
}
