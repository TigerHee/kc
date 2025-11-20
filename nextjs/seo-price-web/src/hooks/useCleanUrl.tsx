/**
 * Owner: kevyn.yu@kupotech.com
 */
import { useEffect } from 'react';
// import { useRouter } from 'kc-next/compat/router';
import { usePathname, useSearchParams } from 'next/navigation';

const useCleanUrl = () => {
  // const router = useRouter();
  const query = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    // 去掉url query参数
    if (!query.has('_cms_hash') && !query.has('_cms_ts') && !query.has('previewCode')) {
      // router.replace(pathname);
    }
  }, [pathname, query]);
};

export default useCleanUrl;
