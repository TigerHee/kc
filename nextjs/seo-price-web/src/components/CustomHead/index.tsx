/**
 * Owner: will.wang@kupotech.com
 */
import { IS_SPA } from "@/config/env";
import SpaHead from "next/dist/shared/lib/head";
import SsrHead from "next/head";

/** 兼容ssr和spa的Head */
export default IS_SPA ? SpaHead : SsrHead;
