/**
 * Owner: larvide.peng@kupotech.com
 */
/* eslint-disable kupo-lint/no-dangerously-html */
import { styled, useMediaQuery, Button } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { map } from 'lodash';
import { useCallback } from 'react';
import { _t } from 'tools/i18n';
import { fuzzyHighlight } from 'components/SecurityMenu/SearchInput';

const Wrap = styled.div`
  height: 100%;
  padding-bottom: 60px;
`;
const FooterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 26px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));

  .KuxButton-root {
    width: 100%;
  }
`;
const Title = styled.div`
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const Content = styled.div`
  margin: 32px 0 16px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
  .light {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
const Item = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  > svg {
    color: ${({ theme }) => theme.colors.cover40};
  }
  :last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
`;
const Text = styled.div`
  display: block;
  display: -webkit-box;
  max-height: 3.8em;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  [dir='rtl'] & {
    margin-right: 28px;
  }
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
  .text-highlight {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const Empty = styled.div`
  martin-top: 32px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
`;
const H1 = styled.h1`
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    font-size: 14px;
  }
`;
const EmptyText = styled.p`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

const SearchContent = ({ serchContent, keyword, clearSearchContent, onChangeArticleAnchor }) => {
  const xl = useMediaQuery((theme) => theme.breakpoints.down('xl'));
  const lg = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const clickSearchResultHandler = useCallback((item) => {
    clearSearchContent();
    onChangeArticleAnchor(item);
  }, []);

  return (
    <Wrap>
      <Title id="search_title">
        {_t(serchContent.length === 0 ? '6f1c22be38524000a5a0' : 'dfc2bae523cb4000aaa1', {
          keyword: keyword,
        })}
      </Title>
      <Content>
        {serchContent.length === 0 ? (
          <Empty>
            <H1>{_t('693e19f80f404000a596')}</H1>
            <EmptyText>{_t('6a032f73f1104000a97c')}</EmptyText>
          </Empty>
        ) : (
          map(serchContent, (item) => {
            return (
              <Item key={item.id} onClick={() => clickSearchResultHandler(item)}>
                <Text
                  dangerouslySetInnerHTML={{ __html: fuzzyHighlight(_t(item.title), keyword) }}
                />
                <ICArrowRight2Outlined size={xl ? 16 : 24} />
              </Item>
            );
          })
        )}
      </Content>
      {lg && (
        <FooterWrapper>
          <Button type="default" onClick={clearSearchContent}>
            {_t('742d1c5f54194000a83b')}
          </Button>
        </FooterWrapper>
      )}
    </Wrap>
  );
};

export default SearchContent;
