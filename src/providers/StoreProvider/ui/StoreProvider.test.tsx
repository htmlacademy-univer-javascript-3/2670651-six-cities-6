import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StoreProvider } from './StoreProvider';

describe('StoreProvider', () => {
  it('renders children', () => {
    render(
      <StoreProvider>
        <div>Child</div>
      </StoreProvider>
    );

    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});

