type ClassValue = string | Record<string, boolean | undefined | null>;

export default function classNames(...values: ClassValue[]): string {
  const classes: string[] = [];

  values.forEach((value) => {
    if (!value) {
      return;
    }
    if (typeof value === 'string') {
      classes.push(value);
    } else {
      Object.entries(value).forEach(([key, enabled]) => {
        if (enabled) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}
