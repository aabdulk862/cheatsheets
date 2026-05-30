import { useState, useEffect, useRef } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

interface TimerProps {
  durationMinutes: number;
}

/**
 * Formats a time value in seconds to MM:SS string.
 * Exported for independent testing.
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function Timer({ durationMinutes }: TimerProps) {
  const initialSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setStatus('done');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status]);

  function handleClick() {
    switch (status) {
      case 'idle':
      case 'done':
        setTimeLeft(initialSeconds);
        setStatus('running');
        break;
      case 'running':
        setStatus('paused');
        break;
      case 'paused':
        setStatus('running');
        break;
    }
  }

  function getButtonLabel(): string {
    switch (status) {
      case 'idle':
        return 'Start';
      case 'running':
        return 'Pause';
      case 'paused':
        return 'Resume';
      case 'done':
        return 'Start';
    }
  }

  const displayClass = `timer-display${status === 'done' ? ' expired' : ''}`;

  return (
    <>
      <span className={displayClass} aria-live="polite" aria-atomic="true">
        {formatTime(timeLeft)}
      </span>
      <button className="timer-btn" onClick={handleClick} aria-label={`Timer: ${getButtonLabel()}`}>
        {getButtonLabel()}
      </button>
    </>
  );
}
