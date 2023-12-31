import { render, screen, act } from '@testing-library/react';
import Clock from './Clock';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe('Clock', () => {
  it('should display time for each second', async () => {
    const mockFn = vi.fn();

    render(<Clock gameOver={false} gameOverDispatch={mockFn} />);

    const clock0 = await screen.findByTestId('clock');
    expect(clock0.textContent).toBe('00:00:00');

    act(() => {
      vi.runAllTimers();
    });

    const clock1 = await screen.findByTestId('clock');
    expect(clock1.textContent).toBe('00:00:01');

    act(() => {
      vi.runAllTimers();
    });

    const clock2 = await screen.findByTestId('clock');
    expect(clock2.textContent).toBe('00:00:02');

    act(() => {
      vi.runAllTimers();
    });

    const clock3 = await screen.findByTestId('clock');
    expect(clock3.textContent).toBe('00:00:03');
  });

  it('should stop counting if gameover', async () => {
    const mockFn = vi.fn();

    const { rerender } = render(
      <Clock gameOver={false} gameOverDispatch={mockFn} />,
    );

    act(() => {
      vi.runAllTimers();
    });

    const clock = await screen.findByTestId('clock');
    expect(clock.textContent).toBe('00:00:01');

    rerender(<Clock gameOver={true} gameOverDispatch={() => {}} />);

    act(() => {
      vi.runAllTimers();
    });

    const clockStopped = await screen.findByTestId('clock');
    expect(clockStopped.textContent).toBe('00:00:01');
  });
});
