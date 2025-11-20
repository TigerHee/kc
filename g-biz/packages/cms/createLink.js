/**
 * Owner: iron@kupotech.com
 */
import getTimestamp from './getTimestamp';

const noop = () => {};

export default (href, meta) => {
  const isExist = document.querySelector(`link[data-meta=${meta}]`);
  if (isExist) {
    return noop;
  }
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', `${href}?t=${getTimestamp()}`);
  if (meta) {
    link.setAttribute('data-meta', meta);
  }

  document.head.append(link);

  return () => {
    link.remove();
  };
};
