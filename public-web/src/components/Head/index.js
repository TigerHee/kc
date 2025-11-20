/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useCallback, useState } from 'react';
import { Helmet } from 'react-helmet';

// 用于记录Head 事例;
const mountedHead = new Set();

const METATYPES = ['name', 'httpEquiv', 'charSet', 'itemProp'];

function unique() {
  const keys = new Set();
  const tags = new Set();
  const metaTypes = new Set();
  const metaCategories = {};

  return (h) => {
    let isUnique = true;
    if (h.key && typeof h.key !== 'number' && h.key.indexOf('$') > 0) {
      const key = h.key.slice(h.key.indexOf('$') + 1);
      if (keys.has(key)) {
        isUnique = false;
      } else {
        keys.add(key);
      }
    }

    // eslint-disable-next-line default-case
    switch (h.type) {
      case 'title':
      case 'base':
        if (tags.has(h.type)) {
          isUnique = false;
        } else {
          tags.add(h.type);
        }
        break;
      case 'meta':
        for (let i = 0, len = METATYPES.length; i < len; i++) {
          const metatype = METATYPES[i];
          // eslint-disable-next-line no-prototype-builtins
          if (!h.props.hasOwnProperty(metatype)) {
            // eslint-disable-next-line no-continue
            continue;
          }

          if (metatype === 'charSet') {
            if (metaTypes.has(metatype)) {
              isUnique = false;
            } else {
              metaTypes.add(metatype);
            }
          } else {
            const category = h.props[metatype];
            const categories = metaCategories[metatype] || new Set();
            if (categories.has(category)) {
              isUnique = false;
            } else {
              categories.add(category);
              metaCategories[metatype] = categories;
            }
          }
        }
        break;
    }

    return isUnique;
  };
}

function onlyReactElement(list, child) {
  // React children can be "string" or "number" in this case we ignore them for backwards compat
  if (typeof child === 'string' || typeof child === 'number') {
    return list;
  }
  // Adds support for React.Fragment
  if (child.type === React.Fragment) {
    return list.concat(
      React.Children.toArray(child.props.children).reduce((fragmentList, fragmentChild) => {
        if (typeof fragmentChild === 'string' || typeof fragmentChild === 'number') {
          return fragmentList;
        }
        return fragmentList.concat(fragmentChild);
      }, []),
    );
  }
  return list.concat(child);
}

const Head = (props) => {
  const [heads, updateHeads] = useState([]);

  // 参考next/head 方法，过滤 head
  const resolveHeads = useCallback((_headsInstance) => {
    const _resolvedHeads = _headsInstance
      .reduce((allHeads, ins) => {
        return [...allHeads, ...React.Children.toArray(ins.children)];
      }, [])
      .reduce(onlyReactElement, [])
      .reverse()
      .filter(unique())
      .reverse()
      .map((c, i) => {
        const key = c.key || i;
        return React.cloneElement(c, { key });
      });
    updateHeads(_resolvedHeads);
  }, []);

  useEffect(() => {
    mountedHead.add(props);
    resolveHeads(Array.from(mountedHead));
    return () => {
      mountedHead.delete(props);
      resolveHeads(Array.from(mountedHead));
    };
  }, [props, resolveHeads]);

  return <Helmet>{heads}</Helmet>;
};
// Head.rewind = NextHead.rewind;

export default Head;
