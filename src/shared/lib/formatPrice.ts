export function formatPrice(price: number | null): string {
  if (price === null) {
    return 'We dont know the price yet';
  }
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
  });
}
