import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from '../../../shared/lib/classNames';
import { SORT_OPTIONS, SortType } from '../consts/sort';

type SortOptionsProps = {
  active: SortType;
  onChange: (sort: SortType) => void;
};

export default function SortOptions({ active, onChange }: SortOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  const handleOutsideClick = useMemo(
    () =>
      (event: MouseEvent) => {
        if (
          containerRef.current &&
          event.target instanceof Node &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      },
    []
  );

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  const selectOption = (option: SortType) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get" ref={containerRef}>
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        role="button"
        aria-expanded={isOpen}
      >
        {active}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={classNames('places__options places__options--custom', {
          'places__options--opened': isOpen,
        })}
        data-testid="sort-options"
      >
        {SORT_OPTIONS.map((option) => (
          <li
            key={option}
            className={classNames('places__option', {
              'places__option--active': active === option,
            })}
            tabIndex={0}
            onClick={() => selectOption(option)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                selectOption(option);
              }
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}
