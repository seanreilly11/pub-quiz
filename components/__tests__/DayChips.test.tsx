import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DayChips from '../DayChips';

describe('DayChips', () => {
  it('renders Any plus all 7 days', () => {
    render(<DayChips value="any" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /any/i })).toBeInTheDocument();
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(d => {
      expect(screen.getByRole('button', { name: d })).toBeInTheDocument();
    });
  });

  it('marks the active chip', () => {
    render(<DayChips value="wed" onChange={() => {}} />);
    const active = screen.getByRole('button', { name: 'Wed' });
    expect(active.className).toMatch(/bg-brass/);
  });

  it('calls onChange with the selected day', async () => {
    const onChange = vi.fn();
    render(<DayChips value="any" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tue' }));
    expect(onChange).toHaveBeenCalledWith('tue');
  });

  it('calls onChange with "any" when Any is clicked', async () => {
    const onChange = vi.fn();
    render(<DayChips value="tue" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /any/i }));
    expect(onChange).toHaveBeenCalledWith('any');
  });
});
