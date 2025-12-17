import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FavoritesEmpty } from './FavoritesEmpty';

describe('FavoritesEmpty', () => {
  it('renders empty favorites state', () => {
    render(<FavoritesEmpty />);

    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(
      screen.getByText(/Save properties to narrow down search/i)
    ).toBeInTheDocument();
  });
});

