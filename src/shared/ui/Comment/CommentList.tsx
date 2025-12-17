import { useMemo } from 'react';
import type { ReactNode } from 'react';
import CommentCard from './CommentCard';
import { useGetCommentsByOfferIdQuery } from '../../api/client';

const MAX_REVIEWS_TO_DISPLAY = 10;

type CommentListProps = {
  id: string | undefined;
  children?: ReactNode;
};

export default function CommentList({ id, children }: CommentListProps) {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useGetCommentsByOfferIdQuery(id ?? '', {
    skip: !id,
  });

  const preparedReviews = useMemo(
    () =>
      [...reviews]
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, MAX_REVIEWS_TO_DISPLAY),
    [reviews]
  );

  if (!id) {
    return null;
  }

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>

      {isLoading && <p>Loading comments…</p>}
      {isError && <p>Failed to load comments</p>}

      {!isLoading &&
        !isError &&
        (preparedReviews.length > 0 ? (
          <ul className="reviews__list">
            {preparedReviews.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        ))}

      {children}
    </section>
  );
}
