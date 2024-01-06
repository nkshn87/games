export function calculateOuterNumbers(size: number): number[] {
  if (size < 3) {
    return [];
  }
  const outerNumbers = [];
  const innerSize = size - 2;
  const max = size * size - innerSize * innerSize + 1;

  for (let i = 1; i <= size; i++) {
    outerNumbers.push(i);
  }

  for (let i = 1; i <= size - 2; i++) {
    outerNumbers.push(size + 3 + 2 * (i - 1));
  }

  for (let i = 1; i <= size; i++) {
    outerNumbers.push(max - (i - 1));
  }

  for (let i = 1; i <= size - 3; i++) {
    outerNumbers.push(max - size - (i * 2 - 1));
  }
  outerNumbers.push(size + 1);

  return outerNumbers;
}

export function calculateInnerNumbers(size: number): number[] {
  if (size < 3) {
    return [];
  }
  const innerNumbers = [];

  for (let i = 1; i <= size - 2; i++) {
    for (let j = 1; j <= size - 2; j++) {
      innerNumbers.push(size * j + 1 + i);
    }
  }

  innerNumbers.sort((a, b) => a - b);
  return innerNumbers;
}
