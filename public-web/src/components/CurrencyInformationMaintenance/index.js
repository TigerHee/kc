/**
 * Owner: solar.xia@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { ICSearchOutlined } from '@kux/icons';
import { Alert, EmotionCacheProvider, Global, ThemeProvider, useMediaQuery } from '@kux/mui';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import { _t } from 'src/tools/i18n';
import { exposePageStateForSSG } from 'src/utils/ssgTools';
import warning from 'static/currencyInformationMaintenance/offline-warning.svg';
import LazyImg from '../common/LazyImg';
import {
  StyledAlert,
  StyledBanner,
  StyledBannerContainer,
  StyledCurrencyInfomationMaintenance,
  StyledEmptyText,
  StyledMain,
  StyledMainContainer,
  StyledNameCol,
  StyledSearch,
  StyledSmTime,
  StyledTable,
  StyledTableWrapper,
} from './styledComponent';

function transTime(time) {
  return time ? moment(time).utc().format('YYYY/MM/DD HH:mm:ss') : '--';
}

function Banner() {
  const sm = !useMediaQuery((theme) => theme.breakpoints.up('sm'));
  return (
    <StyledBanner data-inspector="information_currencyOffline_banner">
      <StyledBannerContainer>
        <article>
          <h1>{_t('bPCCabng8Cp1MkEcgRo4po')}</h1>
          <p>{_t('iWt3tX8sAuK5RQYhd4r9Zf')}</p>
          <p>{_t('4RvfypV4FivhLbH4AzHHTg')}</p>
          <p>{_t('9rv3RNZNg2CgUcA4Vs7KC9')}</p>
        </article>
        {!sm && (
          <aside>
            <img src={warning} alt="" />
          </aside>
        )}
      </StyledBannerContainer>
    </StyledBanner>
  );
}

function Search({ handleChange }) {
  return (
    <StyledSearch
      allowSearch
      size="large"
      placeholder={_t('9YKMwS9e2v1UX7NMRGYtbA')}
      addonBefore={<ICSearchOutlined size="17" />}
      onChange={handleChange}
      allowClear
    />
  );
}

const AlertText = ({ isSm }) => {
  const [isExpand, setExpand] = useState(false);
  useEffect(() => {
    if (!isSm) {
      setExpand(false);
    }
  }, [isSm]);
  return (
    <StyledAlert isExpand={!isSm || isExpand}>
      <ul>
        <li>{_t('tGcVu1ei26bJnEwJNSaXoC')}</li>
        <li>{_t('ksJTn8qB5twopSW1q6iFvy')}</li>
      </ul>
      {isSm && (
        <div
          role="button"
          tabIndex="0"
          onClick={() => {
            setExpand((prev) => !prev);
          }}
        >
          {!isExpand && <span>... </span>}
          {isExpand ? _t('jJULvVY8JuzS8kjhKXw9Rv') : _t('4Y1qtJNYuSQShqbZa1X6EE')}
        </div>
      )}
    </StyledAlert>
  );
};

function Main() {
  const [currencyName, setCurrencyName] = useState('');
  const sm = !useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const dispatch = useDispatch();
  const records = useSelector((state) => state.currency_offline.records);
  const pagination = useSelector((state) => state.currency_offline.pagination);

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const offline = dvaState.currency_offline || {};
      return {
        currency_offline: {
          records: offline?.records?.slice(0, 10),
        },
      };
    });
  }, []);

  function handleSearch(payload) {
    dispatch({
      type: 'currency_offline/pullOfflineNotices',
      payload: { currencyName, ...payload },
    });
  }
  const handleSearchChange = useCallback(
    debounce((currencyName) => {
      handleSearch({ currencyName });
    }, 1000),
    [dispatch],
  );

  useEffect(() => {
    handleSearch();
  }, [dispatch]);

  useUpdateEffect(() => {
    handleSearchChange(currencyName);
  }, [currencyName]);

  const currencySearch = <Search handleChange={(e) => setCurrencyName(e.target.value)} />;

  const columns = [
    {
      title: !sm ? currencySearch : null,
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render(_, record) {
        return (
          <>
            <StyledNameCol>
              <LazyImg src={record.currencyIconUrl} alt="currency-icon" />
              <div className="nameContainer">
                <div className="baseCurrencyName">{record.currencyName}</div>
                <div className="baseCurrency">{record.currencyFullName}</div>
              </div>
            </StyledNameCol>
            {sm ? (
              <StyledSmTime>
                <div className="row">
                  <div className="col">{_t('hiR32bM7yvroEjBg7VSkU1')}</div>
                  <div className="col">{transTime(record.closeTradeTime)}</div>
                </div>
                <div className="row">
                  <div className="col">{_t('8vJCPzm4yJyimyscNapk2r')}</div>
                  <div className="col">{transTime(record.closeExchangeTime)}</div>
                </div>
                <div className="row">
                  <div className="col">{_t('pneEAmLzxhXHaD5kMvb7z3')}</div>
                  <div className="col">{transTime(record.closeWithdrawTime)}</div>
                </div>
              </StyledSmTime>
            ) : null}
          </>
        );
      },
    },
    {
      title: _t('hiR32bM7yvroEjBg7VSkU1'),
      dataIndex: 'closeTradeTime',
      key: 'closeTradeTime',
      width: '30%',
      responsive: ['sm', 'md'],
      render: transTime,
    },
    {
      title: _t('8vJCPzm4yJyimyscNapk2r'),
      dataIndex: 'closeExchangeTime',
      key: 'closeExchangeTime',
      width: '20%',
      responsive: ['sm', 'md'],
      render: transTime,
    },
    {
      title: _t('pneEAmLzxhXHaD5kMvb7z3'),
      dataIndex: 'closeWithdrawTime',
      key: 'closeWithdrawTime',
      width: '20%',
      align: 'right',
      responsive: ['sm', 'md'],
      render: transTime,
    },
  ];

  function scrollToTop() {
    const currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentPosition > 0) {
      window.requestAnimationFrame(scrollToTop);
      const scrollSpeed = currentPosition / 8;
      window.scrollTo(0, currentPosition - scrollSpeed);
    }
  }

  function getElementTopPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const elementTopPosition = rect.top + scrollTop;
    return elementTopPosition;
  }

  function getScrollTopPosition() {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    return scrollTop;
  }

  return (
    <StyledMain>
      <StyledMainContainer data-inspector="information_currencyOffline_list">
        <Alert showIcon type="warning" title={<AlertText isSm={sm} />} />
        {sm && currencySearch}
        <StyledTableWrapper id="offline-table">
          <StyledTable
            headerBorder={true}
            size={'basic'}
            dataSource={records}
            columns={columns}
            rowKey="currencyCode"
            bordered={true}
            showHeader={true}
            pagination={{
              ...pagination,
              onChange(_, current, pageSize) {
                const tableToTop = getElementTopPosition(document.getElementById('offline-table'));
                if (getScrollTopPosition() > tableToTop) {
                  scrollToTop();
                }
                handleSearch({ currentPage: current, pageSize });
              },
            }}
            locale={{
              emptyText: (
                <StyledEmptyText>
                  <span>{_t('cLVT36jYLG6F7EYwXY7rxG')}</span>
                </StyledEmptyText>
              ),
            }}
          />
        </StyledTableWrapper>
      </StyledMainContainer>
    </StyledMain>
  );
}
export default function CurrencyInfomationMaintenance() {
  const { isRTL } = useLocale();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
        <Global
          styles={`
            body *{
              font-family: 'Roboto';
            }
            body {
              .root {
                background: ${currentTheme === 'light' ? '#ffffff' : '#121212'};
              
              }
            }
          `}
        />
        <StyledCurrencyInfomationMaintenance>
          <Banner />
          <Main />
        </StyledCurrencyInfomationMaintenance>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
}
