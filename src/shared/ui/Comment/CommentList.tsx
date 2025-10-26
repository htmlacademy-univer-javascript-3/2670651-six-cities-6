import { useEffect, useState } from 'react';
import CommentCard from './CommentCard';
import { Review } from '../../types/comments';
import { commentsApi } from '../../api/client';
import { isAxiosError } from 'axios';

export default function CommentList({ id }: { id: string | undefined }) {
  const [comments, setComments] = useState<Review[] | null>(null);
  useEffect(() => {
    commentsApi
      .getCommentById(id || '')
      .then((response) => setComments(response))
      // eslint-disable-next-line no-console
      .catch((error) => {
        if (isAxiosError(error) && error?.response?.status === 404) {
          setComments([]);
        } else {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      });
  }, [id]);
  return (
    !!comments?.length && (
      <section className="offer__reviews reviews">
        <h2 className="reviews__title">
          Reviews &middot;{' '}
          <span className="reviews__amount">{comments.length}</span>
        </h2>
        <ul className="reviews__list">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </ul>
      </section>
    )
  );
}
