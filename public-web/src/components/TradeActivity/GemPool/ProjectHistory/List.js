/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowDownOutlined } from '@kux/icons';
import { Breadcrumb, Empty, Spin, styled, useResponsive } from '@kux/mui';
import { Link } from 'components/Router';
import { memo, useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import logo2 from 'static/gempool/logo2.png';
import { _t } from 'tools/i18n';
import { locateToUrlInApp } from '../../utils';
import { POOL_STATUS } from '../config';
import ProjectItem from '../containers/ProjectItem';

const StyledHistory = styled.div`
  margin-bottom: 64px;

  padding-top: 12px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 0;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 120px;
  }
`;

const HistoryItemWrapper = styled.div`
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;

const TitleWrapper = styled.h1`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  padding: 0 16px;
  margin: 0;
  color: ${(props) => props.theme.colors.text};
  img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    transform: rotateY(0deg);
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
    font-size: 24px;
    img {
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
    font-weight: 600;
    font-size: 36px;
    img {
      width: 48px;
      height: 48px;
    }
  }
`;

const HistoryListWrapper = styled.div``;

const BreadcrumbWrapper = styled.div`
  padding: 0 16px 12px;
  margin-bottom: 8px;
  a {
    color: inherit;
    text-decoration: none;
    border: none;
    outline: none;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 16px;
    padding: 26px 0 12px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 48px;
    padding: 26px 0 12px;
  }
`;

const MoreWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MoreSpanItem = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 24px; // 解决loading时高度变化
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    margin-left: 2px;
    color: ${(props) => props.theme.colors.icon};
  }
`;

const EmptyWrapper = styled.div`
  height: 260px;
  text-align: center;
  display: flex;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: 460px;
  }
`;

const itemsBreadcrumb = [
  {
    key: 'home',
    name: _t('3f14d758f7b84000a527'),
    path: '/gempool',
  },
  {
    key: 'current',
    name: _t('e6e8b4693eab4000af9b'),
  },
];

function HistoryProjects({}) {
  const isInApp = JsBridge.isApp();
  const { sm } = useResponsive();
  const dispatch = useDispatch();

  const historyRecords = useSelector((state) => state.gempool.historyRecords, shallowEqual);
  const loading = useSelector((state) => {
    return state.loading.effects['gempool/pullGemPoolHistoryRecords'];
  });

  const { currentPage, pageSize, totalPage, items } = historyRecords || {};

  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolHistoryRecords',
    });
  }, [dispatch]);

  const handleMore = useCallback(() => {
    dispatch({
      type: 'gempool/pullGemPoolHistoryRecords',
      payload: {
        currentPage: 1,
        pageSize: pageSize + 5,
      },
    });
  }, [pageSize, dispatch]);

  const handleLocateTo = useCallback((url) => {
    locateToUrlInApp(url);
  }, []);

  return (
    <StyledHistory>
      {!isInApp && (
        <BreadcrumbWrapper>
          <Breadcrumb>
            {itemsBreadcrumb.map((item) => (
              <Breadcrumb.Item key={item?.item}>
                {item?.path ? (
                  <Link
                    to={item.path}
                    onClick={() => handleLocateTo(item.path)}
                    dontGoWithHref={isInApp}
                  >
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </BreadcrumbWrapper>
      )}

      <TitleWrapper>
        <LazyImg src={logo2} alt="logo" />
        {_t('e6e8b4693eab4000af9b')}
      </TitleWrapper>
      <HistoryListWrapper data-inspector="inspector_gempoolHistory_list">
        {!items?.length ? (
          <EmptyWrapper>
            <Empty description={_t('678WABnThqkABxZsmacgsA')} size={!sm ? 'small' : 'large'} />
          </EmptyWrapper>
        ) : (
          items?.map((item) => {
            return (
              <HistoryItemWrapper key={item?.campaignId}>
                <ProjectItem {...item} status={POOL_STATUS.COMPLETED} />
              </HistoryItemWrapper>
            );
          })
        )}
      </HistoryListWrapper>
      {!!(currentPage && totalPage && currentPage < totalPage) && (
        <MoreWrapper>
          {loading ? (
            <Spin spinning={true || loading} type="normal" />
          ) : (
            <MoreSpanItem onClick={handleMore}>
              {_t('2YyXGzmRgscwyygscEYUgi')}
              <ICArrowDownOutlined />
            </MoreSpanItem>
          )}
        </MoreWrapper>
      )}
    </StyledHistory>
  );
}

export default memo(HistoryProjects);
