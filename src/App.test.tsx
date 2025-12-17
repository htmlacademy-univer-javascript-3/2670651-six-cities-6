import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const dispatchMock = vi.hoisted(() => vi.fn());

vi.mock('./shared/lib/hooks/redux', () => ({
  useAppDispatch: () => dispatchMock,
}));

vi.mock('./router/AppRouter', () => ({
  AppRouter: () => <div>Router</div>,
}));

import App from './App';

describe('App', () => {
  it('dispatches checkAuth on mount', async () => {
    render(<App />);

    expect(screen.getByText('Router')).toBeInTheDocument();

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});

