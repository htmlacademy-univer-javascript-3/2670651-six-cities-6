import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import ErrorModal from '../ErrorModal/ErrorModal';
import RatingInput from './InputRating';
import type { CommentDTO } from '../../types/comments';
import { usePostNewCommentMutation } from '../../api/client';

type CommentFormProps = {
  offerId: string;
};

const MIN_REVIEW_LENGTH = 50;
const RATINGS = [5, 4, 3, 2, 1];

export default function CommentForm({ offerId }: CommentFormProps) {
  const [formData, setFormData] = useState<CommentDTO>({
    rating: 0,
    comment: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [postNewComment, { isLoading: isSubmitting }] =
    usePostNewCommentMutation();

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      rating: Number(event.target.value),
    }));
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      comment: event.target.value,
    }));
  };

  const isSubmitDisabled =
    isSubmitting ||
    formData.rating === 0 ||
    formData.comment.trim().length < MIN_REVIEW_LENGTH;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setErrorMessage(null);

    try {
      await postNewComment({
        offerId,
        data: {
          comment: formData.comment.trim(),
          rating: formData.rating,
        },
      }).unwrap();
      setFormData({
        rating: 0,
        comment: '',
      });
    } catch (error) {
      const details =
        error instanceof Error ? ` ${error.message}` : '';
      setErrorMessage(
        `Something went wrong while submitting your review. Try again later.${details}`
      );
    }
  };

  return (
    <form
      className="reviews__form form"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label className="reviews__label form__label" htmlFor="comment">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {RATINGS.map((rating) => (
          <RatingInput
            key={rating}
            rating={rating}
            checked={formData.rating === rating}
            onChange={handleRatingChange}
            disabled={isSubmitting}
          />
        ))}
      </div>
      <textarea
        onChange={handleCommentChange}
        className="reviews__textarea form__textarea"
        id="comment"
        name="comment"
        placeholder="Tell how was your stay, what you like and what can be improved"
        minLength={MIN_REVIEW_LENGTH}
        value={formData.comment}
        required
        disabled={isSubmitting}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </form>
  );
}
