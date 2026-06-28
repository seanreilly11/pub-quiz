import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrustStamp from '../TrustStamp';
import type { Verification } from '@/lib/types';

const confirmedVerification: Verification = {
  source: 'pub', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '12 Jun',
};

const websiteVerification: Verification = {
  source: 'website', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '',
};

describe('TrustStamp', () => {
  it('shows confirmed heading and date', () => {
    render(<TrustStamp verification={confirmedVerification} />);
    expect(screen.getByText(/checked with the pub/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Jun/)).toBeInTheDocument();
    expect(screen.getByText(/confirmed by reply/i)).toBeInTheDocument();
  });

  it('shows website heading for source=website', () => {
    render(<TrustStamp verification={websiteVerification} />);
    expect(screen.getByText(/from their website/i)).toBeInTheDocument();
    expect(screen.getByText(/awaiting pub reply/i)).toBeInTheDocument();
  });
});
