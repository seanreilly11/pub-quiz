import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VerificationTrail from '../VerificationTrail';
import type { Verification } from '@/lib/types';

const pubVerification: Verification = {
  source: 'pub', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '12 Jun',
};
const websiteVerification: Verification = {
  source: 'website', foundDate: '2 Apr', emailDate: '5 Apr', confirmedDate: '',
};

describe('VerificationTrail', () => {
  it('shows all 3 steps', () => {
    render(<VerificationTrail verification={pubVerification} domain="foxedbadger.co.uk" />);
    expect(screen.getByText(/found on their website/i)).toBeInTheDocument();
    expect(screen.getByText(/emailed the pub/i)).toBeInTheDocument();
    expect(screen.getByText(/pub confirmed/i)).toBeInTheDocument();
  });

  it('shows foundDate in step 1', () => {
    render(<VerificationTrail verification={pubVerification} domain="foxedbadger.co.uk" />);
    expect(screen.getByText(/2 Apr/)).toBeInTheDocument();
  });

  it('shows "reply pending" for website source', () => {
    render(<VerificationTrail verification={websiteVerification} domain="anchorcompass.co.uk" />);
    expect(screen.getByText(/reply pending/i)).toBeInTheDocument();
  });
});
