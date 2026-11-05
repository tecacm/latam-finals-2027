import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Countdown from './Countdown';

describe('Countdown', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('says "Date to be announced" without a target', () => {
    render(<Countdown target={null} />);
    expect(screen.getByRole('status')).toHaveTextContent('Date to be announced');
  });

  it('says "Date to be announced" for an unparsable target', () => {
    render(<Countdown target="not a date" />);
    expect(screen.getByRole('status')).toHaveTextContent('Date to be announced');
  });

  it('says the championship has started for a past target', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-06-01T00:00:00Z'));
    render(<Countdown target="2027-05-01T00:00:00Z" />);
    expect(screen.getByRole('status')).toHaveTextContent('The championship has started');
  });

  it('renders zero-padded units with singular/plural labels and ticks every second', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'));
    render(<Countdown target="2027-01-02T02:03:04Z" />);

    const timer = screen.getByRole('timer');
    expect(within(timer).getByText('01')).toBeInTheDocument();
    expect(within(timer).getByText('day')).toBeInTheDocument();
    expect(within(timer).getByText('02')).toBeInTheDocument();
    expect(within(timer).getByText('hours')).toBeInTheDocument();
    expect(within(timer).getByText('03')).toBeInTheDocument();
    expect(within(timer).getByText('minutes')).toBeInTheDocument();
    expect(within(timer).getByText('04')).toBeInTheDocument();
    expect(within(timer).getByText('seconds')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(within(timer).getAllByText('03')).toHaveLength(2); // minutes and seconds
    expect(within(timer).queryByText('04')).not.toBeInTheDocument();
  });

  it('switches to the started message when the target passes while open', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'));
    render(<Countdown target="2027-01-01T00:00:02Z" />);
    expect(screen.getByRole('timer')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('The championship has started');
  });
});
