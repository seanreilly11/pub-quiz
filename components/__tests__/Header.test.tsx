import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

describe('Header', () => {
  it('renders the wordmark', () => {
    render(<Header />);
    expect(screen.getByText('ROUND TWO')).toBeInTheDocument();
  });

  it('renders meet-in-the-middle link on desktop', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /meet in the middle/i })).toBeInTheDocument();
  });
});
