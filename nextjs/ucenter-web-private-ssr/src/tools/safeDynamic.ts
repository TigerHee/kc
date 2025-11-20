import dynamic from 'next/dynamic';

export function safeDynamic(importer, options) {
  return dynamic(
    () =>
      importer().catch((err) => {
        console.error('[Dynamic import failed]', err);
        throw err; // ❗让错误重新冒泡
      }),
    options,
  );
}
