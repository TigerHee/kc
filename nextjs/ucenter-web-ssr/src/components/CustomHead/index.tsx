import { IS_SPA_MODE } from 'kc-next/env';
import SpaHead from 'next/dist/shared/lib/head';
import SsrHead from 'next/head';

/** 兼容ssr和spa的Head */
export default IS_SPA_MODE ? SpaHead : SsrHead;
