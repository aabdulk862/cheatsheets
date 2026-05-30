import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createElement } from 'react';
import Timer, { formatTime } from '../../src/components/Timer';

describe('formatTime', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats 60 seconds as 01:00', () => {
    expect(formatTime(60)).toBe('01:00');
  });

  it('formats 90 minutes (5400 seconds) as 90:00', () => {
    expect(formatTime(5400)).toBe('90:00');
  });

  it('formats 61 seconds as 01:01', () => {
    expect(formatTime(61)).toBe('01:01');
  });

  it('formats 9 seconds as 00:09 (pads single digit)', () => {
    expect(formatTime(9)).toBe('00:09');
  });

  it('formats 3599 seconds as 59:59', () => {
    expect(formatTime(3599)).toBe('59:59');
  });
});

describe('Timer component', () => {
  it('renders initial time from durationMinutes prop', () => {
    render(createElement(Timer, { durationMinutes: 90 }));
    expect(screen.getByText('90:00')).toBeInTheDocument();
  });

  it('shows Start button in idle state', () => {
    render(createElement(Timer, { durationMinutes: 60 }));
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('shows Pause button after clicking Start', () => {
    render(createElement(Timer, { durationMinutes: 60 }));
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('shows Resume button after clicking Pause', () => {
    render(createElement(Timer, { durationMinutes: 60 }));
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
  });

  it('preserves time when paused', () => {
    vi.useFakeTimers();
    render(createElement(Timer, { durationMinutes: 1 }));
    
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => { vi.advanceTimersByTime(5000); }); // 5 seconds pass
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    
    expect(screen.getByText('00:55')).toBeInTheDocument();
    
    // Time should not change while paused
    act(() => { vi.advanceTimersByTime(5000); });
    expect(screen.getByText('00:55')).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('applies expired class when timer reaches 00:00', () => {
    vi.useFakeTimers();
    render(createElement(Timer, { durationMinutes: 1 }));
    
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => { vi.advanceTimersByTime(60000); }); // 60 seconds pass
    
    expect(screen.getByText('00:00')).toBeInTheDocument();
    const display = screen.getByText('00:00');
    expect(display).toHaveClass('expired');
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('resets to initial duration when Start is clicked after done', () => {
    vi.useFakeTimers();
    render(createElement(Timer, { durationMinutes: 1 }));
    
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    act(() => { vi.advanceTimersByTime(60000); });
    
    // Now in done state, click Start to reset
    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
