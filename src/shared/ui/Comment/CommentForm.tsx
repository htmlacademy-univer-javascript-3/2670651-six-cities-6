import { useState } from 'react';
import { commentsApi } from '../../api/client';

import { offers } from '../../../mock/offers';

import ErrorModal from '../ErrorModal/ErrorModal';
import RatingInput from './InputRating';
import { CommentDTO } from '../../types/comments';

export default function CommentForm() {
  const [formData, setFormData] = useState<CommentDTO>({
    rating: 0,
    comment: '',
    isFormValid: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: CommentDTO) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
      isFormValid: name === 'comment' && value.length >= 50 ,
    }));

  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.rating || formData.comment.length < 50) {
      return;
    }

    setIsSubmitting(true);

    commentsApi
      .postNewComment(
        {
          comment: formData.comment,
          rating: formData.rating,
        },
        offers[0].id
      )
      .then(() => {
        setFormData({ rating: 0, comment: '' });
      })
      .catch((error) => {
        setErrorMessage(`Something went wrong while submitting your review. Try again later. ${error}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {[5,4,3,2,1].map((rating) => (
          <RatingInput
            key={rating}
            rating={rating}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData({
                rating: Number(e?.target?.value ?? 0),
                comment: formData.comment,
                isFormValid: formData.comment.length >= 50,
              });

            }}
          />
        ))}
      </div>
      <textarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}
        className="reviews__textarea form__textarea"
        id="comment"
        name="comment"
        placeholder="Tell how was your stay, what you like and what can be improved"
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
          disabled={isSubmitting || !(formData.comment.length >= 50)}
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
