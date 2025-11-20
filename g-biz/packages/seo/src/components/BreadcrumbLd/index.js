/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Breadcrumb, ThemeProvider } from '@kufox/mui';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { map } from 'lodash';
import PropTypes from 'prop-types';

const linkStyle = { color: 'inherit' };
const flexBox = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' };
const defaultFun = () => {};

const BreadcrumbLd = ({
  list = [],
  push = defaultFun,
  addLangToPath,
  justStructData = false,
  baseName,
  ...rest
} = {}) => {
  const [breadJson, setBreadJson] = useState();
  const [breadList, setBreadList] = useState(list);

  useEffect(() => {
    const completeUrlList = list.map((item) => {
      if (item.route && item.route.startsWith('http')) {
        return {
          ...item,
          url: addLangToPath(item.route),
        };
      }
      if (item.route && item.route.startsWith('/')) {
        let _url = item.route;
        if (baseName && !_url.startsWith(baseName)) {
          _url = `${baseName}${_url}`;
        }
        _url = `${window.location.origin}${_url}`;
        if (_url.endsWith('/')) {
          _url = _url.substring(0, _url.length - 1);
        }
        return {
          ...item,
          url: addLangToPath(_url),
        };
      }
      return { ...item, url: item.route };
    });
    setBreadList(completeUrlList);
  }, [list, baseName, addLangToPath]);

  useEffect(() => {
    const bread = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    };
    breadList.forEach((item, index) => {
      if (item.name) {
        const listItem = {
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
        };
        if (item.url) {
          listItem.item = item.url;
        }
        bread.itemListElement.push(listItem);
      }
    });
    try {
      setBreadJson(JSON.stringify(bread));
    } catch (error) {
      setBreadJson('{}');
    }
  }, [breadList]);

  const handleClick = useCallback(
    (e, item) => {
      if (item.route && item.route.startsWith('/')) {
        e.preventDefault();
        push(item.route);
      }
    },
    [push],
  );

  if (breadList && !breadList.length) {
    return null;
  }

  if (justStructData) {
    return (
      <HelmetProvider>
        <Helmet>
          <script type="application/ld+json" data-inspector="seo-breadcrumLd">
            {breadJson}
          </script>
        </Helmet>
      </HelmetProvider>
    );
  }

  return (
    <div {...rest}>
      <HelmetProvider>
        <Helmet>
          <script type="application/ld+json" data-inspector="seo-breadcrumLd">
            {breadJson}
          </script>
        </Helmet>
      </HelmetProvider>
      <Breadcrumb style={flexBox}>
        {map(breadList, (item, idx) => (
          <Breadcrumb.Item key={idx}>
            {item.route ? (
              <a
                href={item.url}
                style={linkStyle}
                onClick={(e) => {
                  handleClick(e, item);
                }}
              >
                {item.name}
              </a>
            ) : (
              item.name
            )}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

BreadcrumbLd.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      route: PropTypes.string,
    }),
  ),
  push: PropTypes.func.isRequired,
  addLangToPath: PropTypes.func.isRequired,
  justStructData: PropTypes.bool,
};

BreadcrumbLd.defaultProps = {
  list: [],
  justStructData: false,
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <BreadcrumbLd {...props} />
    </ThemeProvider>
  );
};
