/**
 * Owner: brick.fan@kupotech.com
 */

import React, { useState } from 'react';
import { _t } from 'tools/i18n';
import { styled, Drawer, useMediaQuery, MDialog, Button } from '@kux/mui';
import SearchInput from './SearchInput';
import ArticleTree from './ArticleTree';
import history from '@kucoin-base/history';
import { canSearchArticles, articles } from './config';
import { fuzzyHighlight } from './SearchInput';

const CusDrawer = styled(Drawer)`
  width: 480px;
`;

const Content = styled.div`
  padding: 24px 32px;
  .tree-container {
    padding: 24px 0;
    .parent-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      svg {
        width: 20px;
        height: 20px;
        margin-left: 10px;
      }
    }
    // 第一层 title
    .ul-1 > li > .parent-title {
      padding: 16px 0;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 700;
      font-size: 24px;
      font-style: normal;
      line-height: 130%;

      & > .is-article {
        padding-left: 0;
      }
    }
    // 第二层 title
    .ul-2 > li > .parent-title {
      padding: 12px 0;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 400;
      font-size: 20px;
      font-style: normal;
      line-height: 130%;
    }

    // 文章
    .article-title {
      padding: 12px 16px;
      color: ${({ theme }) => theme.colors.text};
      font-size: 20px;
      line-height: 130%;
      cursor: pointer;
      &:hover {
        background: ${({ theme }) => theme.colors.cover2};
      }
    }

    // 第二层的文章
    .ul-2 > li > .article-title {
      padding-left: 0;
    }

    .ul-1 > li {
      border-bottom: 0.5px solid ${({ theme }) => theme.colors.divider8};
    }
  }
`;

const CusMDialog = styled(MDialog)`
  .KuxMDialog-content {
    height: 100%;
    overflow: hidden;
  }
`;

const SmContent = styled.div`
  position: relative;
  height: 100%;
  .sm-content {
    height: 100%;
    padding: 16px;
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
    overflow-y: auto;
  }
  .input-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    .KuxButton-root {
      margin-left: 8px;
    }
  }
  .sm-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    background-color: white;
    .KuxButton-root {
      width: 100%;
    }
  }
  .tree-container {
    .parent-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      svg {
        width: 16px;
        height: 16px;
        margin-left: 10px;
      }
    }
    // 第一层 title
    .ul-1 > li > .parent-title {
      padding: 14px 0;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;

      /* & > .is-article {
        padding-left: 0;
      } */
    }
    // 第二层 title
    .ul-2 > li > .parent-title {
      padding: 12px 0 12px 12px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }

    // 文章
    .article-title {
      padding: 12px 0 12px 12px;
      color: ${({ theme }) => theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
      cursor: pointer;
    }

    // 第三层的文章
    .ul-3 > li > .article-title {
      padding-left: 28px;
    }
  }
`;

const DrawerTree = ({ isHomePage = false, show, onClose, onChangeArticleAnchor, onSerch }) => {
  const [serchContent, setSerchContent] = useState('');
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleMobileSelect = (article) => {
    onChangeArticleAnchor(article);
    onClose();
  };

  const handleMdSelect = (c, k) => {
    if (isHomePage) return;
    onSerch(c, k);
    window.scrollTo?.(0, 0);
  };

  const onSerchHandler = () => {
    const filteredList = () => {
      if (!serchContent) return [];
      const result = [];
      canSearchArticles.forEach((item) => {
        if (_t(item.title).toLowerCase().includes(serchContent.toLowerCase())) {
          const highlighted = fuzzyHighlight(_t(item.title), serchContent);
          result.push({ ...item, highlighted });
        }
      });
      return result;
    };
    if (isHomePage) {
      const _filteredList = filteredList();
      history.push(_filteredList.length ? `${_filteredList[0].path}` : `${articles[0].path}`, {
        filteredList: _filteredList,
        value: serchContent,
      });
    } else {
      onSerch(filteredList, serchContent);
    }
  };

  if (isSm) {
    return (
      <CusMDialog
        title={_t('eea697de6c2b4000a2c9')}
        show={show}
        onClose={onClose}
        maskClosable
        back={false}
        footer={null}
        onCancel={onClose}
        height={{ maxHeight: '90vh' }}
        style={{ borderRadius: '16px 16px 0px 0px' }}
      >
        <SmContent>
          <div className="sm-content">
            <div className="input-line">
              <SearchInput
                inputProps={{
                  size: 'medium',
                }}
                isHomePage={isHomePage}
                onChangeArticleAnchor={handleMobileSelect}
                updateInputValue={setSerchContent}
              />
              <Button data-testid="search_button" onClick={onSerchHandler}>
                {_t('86fd144a90fa4000a7e5')}
              </Button>
            </div>
            <div className="tree-container">
              <ArticleTree isHomePage={isHomePage} onClose={onClose} />
            </div>
          </div>
          <div className="sm-footer">
            <Button data-testid="security_sm_cancel_button" type="default" onClick={onClose}>
              {_t('742d1c5f54194000a83b')}
            </Button>
          </div>
        </SmContent>
      </CusMDialog>
    );
  }

  return (
    <CusDrawer
      title={_t('eea697de6c2b4000a2c9')}
      maskClosable
      show={show}
      onClose={onClose}
      back={false}
    >
      <Content>
        <SearchInput
          inputProps={{
            size: 'xlarge',
          }}
          isHomePage={isHomePage}
          onChangeArticleAnchor={onChangeArticleAnchor}
          onEnterHandler={handleMdSelect}
          onClose={onClose}
        />
        <div className="tree-container">
          <ArticleTree isHomePage={isHomePage} onClose={onClose} />
        </div>
      </Content>
    </CusDrawer>
  );
};

export default DrawerTree;
