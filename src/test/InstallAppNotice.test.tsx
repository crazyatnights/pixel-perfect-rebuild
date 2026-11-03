import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import InstallAppNotice from '@/components/InstallAppNotice';

let mobile = true;
let standalone = false;
vi.mock('@/hooks/use-mobile', () => ({ useIsMobile: () => mobile }));

beforeEach(() => {
  mobile = true;
  standalone = false;
  vi.useFakeTimers();
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: vi.fn(() => ({
    matches: standalone, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })) });
});
afterEach(() => { cleanup(); vi.useRealTimers(); });
const showNotice = () => { render(<InstallAppNotice />); act(() => { vi.advanceTimersByTime(3000); }); };

describe('phone installation', () => {
  it('offers installation on mobile screens', () => {
    showNotice();
    expect(screen.getByRole('complementary', { name: 'Instalar aplicación' })).toBeInTheDocument();
  });
  it('does not offer installation on desktop screens', () => {
    mobile = false;
    showNotice();
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('does not offer installation when already launched as an app', () => {
    standalone = true;
    showNotice();
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('invokes the browser installation prompt when available', async () => {
    showNotice();
    const event = new Event('beforeinstallprompt', { cancelable: true });
    const prompt = vi.fn().mockResolvedValue(undefined);
    Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome: 'accepted' }) });
    act(() => { window.dispatchEvent(event); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: /^Instalar$/ })); });
    expect(prompt).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});