import { Review } from '../../types/comments';

export default function CommentCard({ comment }: { comment: Review }) {
  return (
    <li className="reviews__item" key={comment.id}>
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={comment?.user?.avatarUrl}
            width={54}
            height={54}
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">{comment?.user?.name}</span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span
              style={{
                width: `${(comment.rating / 5) * 100}%`,
              }}
            />
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">{comment.comment ?? ''}</p>
        <time className="reviews__time">{comment.date}</time>
      </div>
    </li>
  );
}
