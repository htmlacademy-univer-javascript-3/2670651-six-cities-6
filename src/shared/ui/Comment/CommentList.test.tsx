import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Review } from '../../types/comments';
import CommentList from './CommentList';

const getCommentsMock = vi.hoisted(() => vi.fn());

vi.mock('../../api/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../api/client')>();
  return {
    ...actual,
    useGetCommentsByOfferIdQuery: getCommentsMock,
  };
});

const createReview = (partial?: Partial<Review>): Review => ({
  id: 'review-id',
  date: '2020-01-01',
  user: {
    name: 'User',
    avatarUrl: '/img/avatar.jpg',
    isPro: false,
  },
  comment: 'Comment',
  rating: 4,
  ...partial,
});

describe('CommentList', () => {
  it('renders nothing when id is not provided', () => {
    getCommentsMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    const { container } = render(<CommentList id={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders loading state', () => {
    getCommentsMock.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(<CommentList id="offer-1" />);

    expect(screen.getByText('Loading comments…')).toBeInTheDocument();
  });

  it('renders error state', () => {
    getCommentsMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(<CommentList id="offer-1" />);

    expect(screen.getByText('Failed to load comments')).toBeInTheDocument();
  });

  it('renders an empty message when there are no reviews', () => {
    getCommentsMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(<CommentList id="offer-1" />);

    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('sorts reviews by date desc and limits the list to 10 items', () => {
    const reviews = Array.from({ length: 12 }, (_, index) =>
      createReview({
        id: `r-${index + 1}`,
        date: `2020-01-${String(index + 1).padStart(2, '0')}`,
        comment: `Comment ${index + 1}`,
      })
    );

    getCommentsMock.mockReturnValue({
      data: reviews,
      isLoading: false,
      isError: false,
    });

    render(
      <CommentList id="offer-1">
        <div>Child content</div>
      </CommentList>
    );

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(10);
    expect(items[0]).toHaveTextContent('Comment 12');
    expect(screen.queryByText('Comment 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Comment 2')).not.toBeInTheDocument();
  });
});

