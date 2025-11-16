type RatingInputProps = {
  rating: number;
  checked: boolean;
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function RatingInput({
  rating,
  checked,
  disabled = false,
  onChange,
}: RatingInputProps) {
  return (
    <>
      <input
        className="form__rating-input visually-hidden"
        name="rating"
        value={rating}
        id={`${rating}-stars`}
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
      />
      <label
        htmlFor={`${rating}-stars`}
        className="reviews__rating-label form__rating-label"
        title="good"
      >
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </>
  );
}
