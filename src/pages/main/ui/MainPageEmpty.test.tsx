import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MainPageEmpty from './MainPageEmpty';

describe('MainPageEmpty', () => {
  it('renders empty state with city name', () => {
    render(<MainPageEmpty cityName="Dusseldorf" />);

    expect(
      screen.getByText('No places to stay available')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We could not find any property available at the moment in Dusseldorf'
      )
    ).toBeInTheDocument();
  });
});

