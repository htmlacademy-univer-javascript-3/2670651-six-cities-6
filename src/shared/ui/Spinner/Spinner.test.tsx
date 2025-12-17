import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders a status indicator with accessible loading text', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});

