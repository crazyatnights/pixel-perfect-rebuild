import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import LoginScreen from '@/components/LoginScreen';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('LoginScreen access', () => {
  it.each(['click', 'enter'])('blocks the specified password via %s', (method) => {
    const onLogin = vi.fn();
    render(<LoginScreen onLogin={onLogin} />);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    const input = screen.getByPlaceholderText('Login password');
    fireEvent.change(input, { target: { value: '738188' } });
    if (method === 'enter') {
      fireEvent.keyDown(input, { key: 'Enter' });
    } else {
      fireEvent.click(screen.getByRole('button', { name: 'Login', exact: true }));
    }
    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('preserves access with another nonempty password', () => {
    const onLogin = vi.fn();
    render(<LoginScreen onLogin={onLogin} />);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    fireEvent.change(screen.getByPlaceholderText('Login password'), { target: { value: 'demo-other' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login', exact: true }));
    expect(onLogin).toHaveBeenCalledTimes(1);
    expect(toast.error).not.toHaveBeenCalled();
  });
});