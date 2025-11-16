import { useMemo } from 'react';
import CommentCard from './CommentCard';
import { useGetCommentsByOfferIdQuery } from '../../api/client';

const MAX_REVIEWS_TO_DISPLAY = 10;

export default function CommentList({ id }: { id: string | undefined }) {
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
  if (isLoading) {
    return <div>Loading comments…</div>;
  }
  if (isError) {
    return <div>Failed to load comments</div>;
  }

  return (
    !!preparedReviews.length && (
      <section className="offer__reviews reviews">
        <h2 className="reviews__title">
          Reviews &middot;{' '}
          <span className="reviews__amount">{reviews.length}</span>
        </h2>
        <ul className="reviews__list">
          {preparedReviews.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ul>
      </section>
    )
  );
}
