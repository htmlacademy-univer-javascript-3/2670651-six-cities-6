export enum SortType {
  Popular = 'Popular',
  PriceLowHigh = 'Price: low to high',
  PriceHighLow = 'Price: high to low',
  TopRated = 'Top rated first',
}

export const SORT_OPTIONS: SortType[] = [
  SortType.Popular,
  SortType.PriceLowHigh,
  SortType.PriceHighLow,
  SortType.TopRated,
];

