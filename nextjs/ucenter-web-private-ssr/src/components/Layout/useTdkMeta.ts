import { usePathname } from 'next/navigation';
import { excludeTdkPath } from '@/tools/tdkTools.ts';
import { serverTdk } from '@kc/tdk';
import { getCurrentLang } from 'kc-next/boot';
import { useInitialProps } from 'gbiz-next/InitialProvider';

export function useTdkMeta() {
  const pageProps = useInitialProps();
  const pathname = usePathname();
  const currentLang = getCurrentLang();

  const tdkMeta = !excludeTdkPath(pathname)
    ? serverTdk.getTdkHelmet(pageProps?.defaultTdk, currentLang)
    : [];

  return tdkMeta;
}
