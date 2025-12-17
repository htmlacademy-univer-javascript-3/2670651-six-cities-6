import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { rootReducer } from '../../../providers/StoreProvider/config/reducer';
import CitiesList from './CitiesList';

describe('CitiesList', () => {
  it('highlights current city and updates it on click', async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: rootReducer });

    render(
      <Provider store={store}>
        <CitiesList />
      </Provider>
    );

    const amsterdam = screen.getByRole('link', { name: 'Amsterdam' });
    const paris = screen.getByRole('link', { name: 'Paris' });

    expect(amsterdam).toHaveClass('tabs__item--active');
    expect(paris).not.toHaveClass('tabs__item--active');

    await user.click(paris);

    expect(store.getState().city.currentCityKey).toBe('PARIS');
    expect(paris).toHaveClass('tabs__item--active');
    expect(amsterdam).not.toHaveClass('tabs__item--active');
  });
});

