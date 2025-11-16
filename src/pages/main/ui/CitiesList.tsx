import { memo } from 'react';
import { CITY_KEYS, CITY_MAP, CityKey } from '../consts/consts';

import { cityActions } from '../model/citySlice';
import { selectCityKey } from '../model/selectors';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../shared/lib/hooks/redux';

function CitiesListBase(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentCityKey = useAppSelector(selectCityKey);

  const handleSelect = (key: CityKey) => dispatch(cityActions.setCityKey(key));

  return (
    <ul className="locations__list tabs__list">
      {CITY_KEYS.map((key) => (
        <li className="locations__item" key={key}>
          <a
            className={`locations__item-link tabs__item ${
              key === currentCityKey ? 'tabs__item--active' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              handleSelect(key);
            }}
            href={`#${key}`}
          >
            <span>{CITY_MAP[key].title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const CitiesList = memo(CitiesListBase);
CitiesList.displayName = 'CitiesList';

export default CitiesList;
