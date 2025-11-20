/**
 * Owner: ella@kupotech.com
 */
import React, { FC, useCallback, useMemo } from 'react';
import { Breadcrumb, ThemeProvider } from '@kux/mui-next';
import addLangToPath from 'tools/addLangToPath';
import { getCurrentLang } from 'kc-next/i18n';
import { getOrigin } from 'kc-next/boot';
import { filterXSS } from 'xss';
import { xssOptions } from 'packages/seo/config';
import SSRHelmet from '../SSRHelmet';

const linkStyle: React.CSSProperties = { color: 'inherit' };
const flexBox: React.CSSProperties = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' };

interface BreadcrumbItem {
  name?: string;
  route?: string;
  url?: string;
}

interface BreadcrumbLdProps extends React.HTMLAttributes<HTMLDivElement> {
  class?: string;
  list?: BreadcrumbItem[];
  push: (route: string) => void;
  addLangToPath: (url: string, lang: string | undefined) => string;
  baseName?: string;
  ssr?: boolean;
}

const defaultFun = () => {};

const getBreadList = (list: BreadcrumbItem[], baseName: string | undefined, currentLang): BreadcrumbItem[] => {
  const completeUrlList = list.map(item => {
    if (item.route && item.route.startsWith('http')) {
      return { ...item, url: addLangToPath(item.route) };
    }

    if (item.route && item.route.startsWith('/')) {
      let _url = item.route;
      if (baseName && !_url.startsWith(baseName)) {
        _url = `${baseName}${_url}`;
      }
      _url = `${getOrigin()}${_url}`;
      if (_url.endsWith('/')) {
        _url = _url.slice(0, -1);
      }
      return { ...item, url: addLangToPath(_url) };
    }

    return { ...item, url: item.route };
  });

  return completeUrlList;
};

export const getBreadcrumbItemList = (options: { list?: BreadcrumbItem[]; baseName?: string }) => {
  const { list = [], baseName } = options;
  const breadList = getBreadList(list, baseName, getCurrentLang());

  const breadItemListElement = breadList.map((item, index) => {
    const listItem: any = {
      '@type': 'ListItem',
      position: index + 1,
      name: filterXSS(item.name || '', xssOptions),
    };

    if (item.url) {
      listItem.item = filterXSS(item.url || '', xssOptions);
    }

    return listItem;
  });

  return breadItemListElement;
};

export const BreadcrumbLdJson: FC<{
  items: BreadcrumbItem[];
  ssr?: boolean;
}> = props => {
  const xssFilteredFAQJson = useMemo(() => {
    const jsonData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: getBreadcrumbItemList({ list: props.items }),
    };

    try {
      const filteredJsonString = JSON.stringify(jsonData);
      return filteredJsonString;
    } catch (error) {
      console.error('Failed to stringify Breadcrumb JSON-LD', error);
      return null;
    }
  }, []);

  if (!xssFilteredFAQJson) return null;

  return (
    <SSRHelmet ssr={props.ssr}>
      {props.ssr ? (
        <script
          type="application/ld+json"
          data-inspector="seo-breadcrumLd"
          dangerouslySetInnerHTML={{
            // xssFilteredFAQJson 已经被xss过滤过，确保安全
            __html: xssFilteredFAQJson,
          }}
        />
      ) : (
        <script type="application/ld+json" data-inspector="seo-breadcrumLd">
          {xssFilteredFAQJson}
        </script>
      )}
    </SSRHelmet>
  );
};

const BreadcrumbLd: React.FC<BreadcrumbLdProps> = ({ list = [], push = defaultFun, baseName, ssr = true, ...rest }) => {
  // const [breadJson, setBreadJson] = useState<string>('');
  const currentLang = getCurrentLang();

  const breadList = useMemo(() => {
    return getBreadList(list, baseName, currentLang);
  }, [list, baseName]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: BreadcrumbItem) => {
      if (item.route && item.route.startsWith('/')) {
        e.preventDefault();
        push(item.route);
      }
    },
    [push]
  );

  if (!breadList.length) return null;

  return (
    <div {...rest}>
      <BreadcrumbLdJson items={breadList} ssr={ssr} />
      <Breadcrumb style={flexBox}>
        {breadList.map((item, idx) => (
          <Breadcrumb.Item key={idx}>
            {item.route ? (
              <a href={item.url} style={linkStyle} onClick={e => handleClick(e, item)}>
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

export default function ThemedBreadcrumbLd(props: BreadcrumbLdProps & { theme?: any }) {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <BreadcrumbLd {...props} />
    </ThemeProvider>
  );
}
