import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import ErrorModal from './ErrorModal';

describe('ErrorModal', () => {
  it('closes on Escape key', () => {
    const onClose = vi.fn();
    render(<ErrorModal message="Boom" onClose={onClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on overlay click', () => {
    const onClose = vi.fn();
    const { container } = render(<ErrorModal message="Boom" onClose={onClose} />);

    const overlay = container.firstElementChild as HTMLElement;
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on close button click', () => {
    const onClose = vi.fn();
    render(<ErrorModal message="Boom" onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

