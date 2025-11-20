export * from './api';
export * from './json';
export * from './schema';

export function supported(): boolean {
  // rome-ignore format: Work around https://github.com/rome/tools/issues/3734
  return typeof window !== 'undefined'
    ? !!(
        // rome-ignore lint(style/useOptionalChain): Optional chaining creates more complicated ES2019 code
        (
          navigator.credentials &&
          // @ts-ignore 忽略校验
          navigator.credentials.create &&
          // @ts-ignore 忽略校验
          navigator.credentials.get &&
          window.PublicKeyCredential
        )
      )
    : true;
}
