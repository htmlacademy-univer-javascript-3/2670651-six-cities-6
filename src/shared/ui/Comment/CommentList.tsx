import CommentCard from './CommentCard';

import { useGetCommentsByOfferIdQuery } from '../../api/client';

export default function CommentList({ id }: { id: string | undefined }) {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useGetCommentsByOfferIdQuery(id ?? '', {
    skip: !id,
  });

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
    !!reviews?.length && (
      <section className="offer__reviews reviews">
        <h2 className="reviews__title">
          Reviews &middot;{' '}
          <span className="reviews__amount">{reviews.length}</span>
        </h2>
        <ul className="reviews__list">
          {reviews.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ul>
      </section>
    )
  );
}
