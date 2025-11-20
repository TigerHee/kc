/**
 * Owner: terry@kupotech.com
 */

const brandKeysCheckHOC = (Comp, active) => (props) => {
  let activeBrandKeys;
  let activeSiteConfig;
  if (Array.isArray(active)) {
    activeBrandKeys = active;
  } else {
    activeSiteConfig = active;
  }

  if (activeSiteConfig && !activeSiteConfig()) {
    window.location.href = '/404';
  }
  if (activeBrandKeys && !activeBrandKeys.includes(window._BRAND_SITE_)) {
    window.location.href = '/404';
  }

  const { children = null, ...rest } = props || {};
  return <Comp {...rest}>{children}</Comp>;
};

export default brandKeysCheckHOC;
