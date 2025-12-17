import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import RatingInput from './InputRating';

describe('RatingInput', () => {
  it('calls onChange when the radio value changes', () => {
    const onChange = vi.fn();

    render(<RatingInput rating={5} checked={false} onChange={onChange} />);

    const input = screen.getByRole('radio');
    fireEvent.click(input);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('respects checked and disabled props', () => {
    render(<RatingInput rating={3} checked disabled onChange={() => undefined} />);

    const input = screen.getByRole<HTMLInputElement>('radio');
    expect(input.checked).toBe(true);
    expect(input.disabled).toBe(true);
  });
});
