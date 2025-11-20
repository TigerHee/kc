/**
 * Owner: larvide.peng@kupotech.com
 */
import { ThemeProvider, styled, useResponsive } from '@kux/mui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { find } from 'lodash';
import history from '@kucoin-base/history';
import loadable from '@loadable/component';
import Sider from './Sider';
import SecurityBreadcrumb from './Breadcrumb';
import Details from './Detail';
import { articles } from 'src/components/SecurityMenu/config';
const MobileMenuNavigator = loadable(() => import('./MobileMenuNavigator'));
const AnchorNavigator = loadable(() => import('./AnchorNavigator'));
const SearchContent = loadable(() => import('./SearchContent'));

const Container = styled.div`
  width: 100%;
  min-height: inherit;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
`;
const Wrap = styled.div`
  width: 100%;
  padding: 26px 64px;
  background-color: ${({ theme }) => theme.colors.overlay};
  padding: 32px 24px 0px 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 32px 16px 0px 16px;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 60px;
  margin-top: 32px;
  ${(props) => props.theme.breakpoints.down('xl')} {
    flex-direction: column;
    gap: 0;
  }
  .content {
    width: calc(100% - 340px);
    ${(props) => props.theme.breakpoints.down('xl')} {
      width: 100%;
    }
  }
  .toc {
    width: 280px;
  }
`;

const SecurityV2Detail = () => {
  const { hash, state } = useLocation();
  const { xl, lg } = useResponsive();
  const [activeArticleKey, setActiveArticleAnchorKey] = useState('');
  const [anchorKey, setAnchorKey] = useState('');
  const [serchContent, setSerchContent] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const clearSearchContent = useCallback(() => {
    setSerchContent(null);
    setSearchValue('');
  }, []);

  const onChangeSearchContent = useCallback(
    (contents, keyword) => {
      if (!keyword) {
        clearSearchContent();
      } else {
        setSerchContent(contents);
        setSearchValue(keyword);
      }
    },
    [clearSearchContent],
  );

  const onChangeArticleAnchor = useCallback(
    (nextActiveArticle) => {
      const { id: nextActiveKey } = nextActiveArticle;
      if (nextActiveKey.startsWith(activeArticleKey.split('-')[0])) {
        setActiveArticleAnchorKey(nextActiveKey);
        window.history.replaceState(undefined, undefined, `#${nextActiveKey}`);
      } else {
        history.push(nextActiveArticle.path);
      }
    },
    [activeArticleKey],
  );

  const handleHashChange = useCallback(() => {
    const Anchor = hash.replace('#', '') || '1-1';
    const article = articles[Anchor.split('-')[0] - 1];
    setActiveArticleAnchorKey(Anchor);
    setAnchorKey(find(article?.children, (item) => item.id === Anchor)?.children[0]?.id);
  }, [hash]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);

  useEffect(() => {
    const { filteredList, value } = state || {};
    if (value && filteredList) {
      setSearchValue(value);
      setSerchContent(filteredList);
    }
    handleHashChange();
  }, [handleHashChange, state]);

  const article = useMemo(() => {
    return articles[activeArticleKey.split('-')[0] - 1];
  }, [activeArticleKey]);

  const articleAnchorList = useMemo(() => {
    return find(article?.children, (item) => item.id === activeArticleKey)?.children || [];
  }, [activeArticleKey, article]);

  if (!article) {
    return null;
  }
  return (
    <>
      <Container>
        {lg ? (
          <Sider
            activeArticleKey={activeArticleKey}
            onChangeArticleAnchor={onChangeArticleAnchor}
            onSerch={onChangeSearchContent}
            onClearSearch={clearSearchContent}
          />
        ) : null}
        <Wrap>
          <SecurityBreadcrumb article={article} />
          {!lg && !Array.isArray(serchContent) ? (
            <MobileMenuNavigator
              activeAnchorKey={anchorKey}
              anchorList={articleAnchorList}
              onClickItem={setAnchorKey}
              onChangeArticleAnchor={onChangeArticleAnchor}
              onSerch={onChangeSearchContent}
              clearSearchContent={clearSearchContent}
            />
          ) : null}
          <Content style={Array.isArray(serchContent) ? { display: 'block' } : null}>
            {Array.isArray(serchContent) ? (
              <SearchContent
                serchContent={serchContent}
                keyword={searchValue}
                clearSearchContent={clearSearchContent}
                onChangeArticleAnchor={onChangeArticleAnchor}
              />
            ) : (
              <>
                <section className="content" data-inspector="security_content">
                  <Details article={article} />
                </section>
                {!xl || articleAnchorList.length === 0 ? null : (
                  <aside className="toc" data-inspector="security_content_anchor">
                    <AnchorNavigator
                      activeAnchorKey={anchorKey}
                      anchorList={articleAnchorList}
                      onClickItem={setAnchorKey}
                    />
                  </aside>
                )}
              </>
            )}
          </Content>
        </Wrap>
      </Container>
    </>
  );
};

export default SecurityV2Detail;
