import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header', () => {
  it('renders the wordmark', () => {
    render(<Header />);
    expect(screen.getByText('Round Two')).toBeInTheDocument();
  });

  it('renders the meet-in-the-middle nav link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /meet in the middle/i })).toBeInTheDocument();
  });
});
