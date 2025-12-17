import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CommentCard from './CommentCard';
import type { Review } from '../../types/comments';

describe('CommentCard', () => {
  it('renders user name, comment text and rating', () => {
    const review: Review = {
      id: 'review-id',
      date: '2019-04-24',
      user: {
        name: 'Max',
        avatarUrl: '/img/avatar-max.jpg',
        isPro: false,
      },
      comment: 'Great place!',
      rating: 4,
    };

    render(<CommentCard comment={review} />);

    const expectedDate = new Date(review.date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
    });

    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
