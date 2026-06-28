import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrustPill from '../TrustPill';

describe('TrustPill — confirmed', () => {
  it('shows "Checked with pub" and date', () => {
    render(<TrustPill source="pub" date="12 Jun" />);
    expect(screen.getByText(/checked with pub/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Jun/)).toBeInTheDocument();
  });

  it('has a solid border (not dashed)', () => {
    const { container } = render(<TrustPill source="pub" date="12 Jun" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/border-confirmed/);
    expect(el.className).not.toMatch(/border-dashed/);
  });
});

describe('TrustPill — website', () => {
  it('shows "From pub\'s site" and date', () => {
    render(<TrustPill source="website" date="2 Apr" />);
    expect(screen.getByText(/from pub's site/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Apr/)).toBeInTheDocument();
  });

  it('has a dashed border', () => {
    const { container } = render(<TrustPill source="website" date="2 Apr" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/border-dashed/);
  });
});

describe('TrustPill — dot shape accessibility', () => {
  it('confirmed dot is round, website dot is square (colourblind-safe)', () => {
    const { container: c1 } = render(<TrustPill source="pub" date="12 Jun" />);
    const { container: c2 } = render(<TrustPill source="website" date="2 Apr" />);
    const dot1 = c1.querySelector('[aria-hidden="true"]') as HTMLElement;
    const dot2 = c2.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(dot1.className).toMatch(/rounded-full/);
    expect(dot2.className).not.toMatch(/rounded-full/);
  });
});
