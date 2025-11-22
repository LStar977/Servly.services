declare module 'memoizee' {
  function memoize<T extends (...args: any[]) => any>(
    fn: T,
    options?: {
      maxAge?: number;
      max?: number;
      primitive?: boolean;
      normalizer?: (...args: any[]) => string;
    }
  ): T;
  export = memoize;
}
