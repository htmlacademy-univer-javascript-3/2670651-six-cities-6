import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import CommentForm from './CommentForm';

const postNewCommentMock = vi.hoisted(() => vi.fn());
const usePostNewCommentMutationMock = vi.hoisted(() => vi.fn());

vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return {
    ...actual,
    usePostNewCommentMutation: usePostNewCommentMutationMock,
  };
});

describe('CommentForm', () => {
  beforeEach(() => {
    postNewCommentMock.mockReset();
    usePostNewCommentMutationMock.mockReset();
    usePostNewCommentMutationMock.mockReturnValue([
      postNewCommentMock,
      { isLoading: false },
    ]);
  });

  it('keeps submit button disabled until rating and comment are valid', async () => {
    const user = userEvent.setup();
    render(<CommentForm offerId="offer-1" />);

    const submit = screen.getByRole('button', { name: 'Submit' });
    expect(submit).toBeDisabled();

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '300');

    await user.type(textarea, 'a'.repeat(49));
    const rating5 = screen.getByDisplayValue('5');
    await user.click(rating5);
    expect(submit).toBeDisabled();

    await user.type(textarea, 'a');

    expect(textarea).toHaveValue('a'.repeat(50));

    expect(submit).toBeEnabled();
  });

  it('submits comment and clears the form on success', async () => {
    const user = userEvent.setup();

    postNewCommentMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });

    render(<CommentForm offerId="offer-1" />);

    await user.click(screen.getByDisplayValue('5'));

    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    const comment = `${'a'.repeat(50)}   `;
    await user.type(textarea, comment);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(postNewCommentMock).toHaveBeenCalledWith({
      offerId: 'offer-1',
      data: { comment: 'a'.repeat(50), rating: 5 },
    });

    await waitFor(() => {
      expect(textarea.value).toBe('');
    });

    expect(screen.getByDisplayValue<HTMLInputElement>('5').checked).toBe(false);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('shows an error modal on submit failure and allows closing it', async () => {
    const user = userEvent.setup();

    postNewCommentMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error('boom')),
    });

    render(<CommentForm offerId="offer-1" />);

    await user.click(screen.getByDisplayValue('4'));
    await user.type(screen.getByRole('textbox'), 'a'.repeat(50));

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText(/Something went wrong while submitting your review/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/boom/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText('Close'));

    await waitFor(() => {
      expect(
        screen.queryByText(/Something went wrong while submitting your review/i)
      ).not.toBeInTheDocument();
    });
  });
});
