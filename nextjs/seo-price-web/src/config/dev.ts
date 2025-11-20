/**
 * Owner: willen@kupotech.com
 */

const inet = typeof window !== 'undefined' ? "/_api" : `${process.env.NEXT_PUBLIC_API_URL}/_api`;
const poolx = "/_pxapi";
const robot = "/_api/_api_robot";

const v2ApiHosts = {
  CMS: inet,
  WEB: inet,
  POOLX: poolx,
  ROBOT: robot,
};

const config = {
  v2ApiHosts,
};

export default config;
