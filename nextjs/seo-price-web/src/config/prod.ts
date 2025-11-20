/**
 * Owner: willen@kupotech.com
 */
const inet = typeof window !== 'undefined' ? "/_api" : `${process.env.NEXT_PUBLIC_API_URL}/_api`;
const poolx = "/_pxapi";
const robot = "/_api_robot";

const config = {
  v2ApiHosts: {
    CMS: inet,
    WEB: inet,
    POOLX: poolx,
    ROBOT: robot,
  },
};

export default config;
