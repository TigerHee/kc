import 'vitest';

declare global {
  const jest: typeof vi;
  namespace jest {
    type Mock<T = any, Args extends any[] = any> = import('vitest').Mock<T, Args>;
  }
}
