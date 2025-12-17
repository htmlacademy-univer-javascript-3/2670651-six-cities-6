import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Points } from '../../../types/map';
import PinList from './PinList';

describe('PinList', () => {
  it('renders titles and calls callback on hover', () => {
    const onListItemHover = vi.fn();
    const points: Points = [
      { title: 'Amsterdam', lat: 52.3, lng: 4.9 },
      { title: 'Paris', lat: 48.8, lng: 2.3 },
    ];

    render(<PinList points={points} onListItemHover={onListItemHover} />);

    fireEvent.mouseEnter(screen.getByText('Amsterdam'));

    expect(onListItemHover).toHaveBeenCalledWith('Amsterdam');
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
});

