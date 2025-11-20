/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICSuccessOutlined, ICWaitOutlined } from '@kux/icons';
import { Button, NumberFormat, styled, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import map from 'lodash/map';
import { memo, useCallback, useMemo, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import datebook from 'static/spotlight7/datebook.svg';
import downSvg from 'static/spotlight7/ic2_double_down.svg';
import processLeftBottom from 'static/spotlight7/processLeftBottom.svg';
import processLeftTop from 'static/spotlight7/processLeftTop.svg';
import processRightBottom from 'static/spotlight7/processRightBottom.svg';
import tableHeader from 'static/spotlight7/tableHeader.png';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import get from 'lodash/get';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.cover2};
  border: 1px solid ${(props) => props.theme.colors.cover16};
  padding: 51px 47px 47px;
  min-height: 370px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 24px 16px 30px;
  }

  .leftTopIcon {
    position: absolute;
    top: -25px;
    left: -1px;
    width: 25px;
    height: 193px;
    background-color: ${(props) => props.theme.colors.overlay};

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .leftBottomIcon {
    position: absolute;
    bottom: -1px;
    left: -1px;
    width: 25px;
    height: 29px;
    background-color: ${(props) => props.theme.colors.overlay};

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .rightIcon {
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 29px;
    height: 29px;
    background-color: ${(props) => props.theme.colors.overlay};

    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }

  .titleWrapper {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 20px;
      font-style: normal;
      line-height: 130%;

      img {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
    }

    ${(props) => props.theme.breakpoints.down('sm')} {
      .title {
        font-weight: 500;
        font-size: 16px;

        img {
          margin-right: 8px;
        }
      }
    }
  }
`;

const ItemsWrapper = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 24px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }

  .header {
    position: relative;
    margin: 24px 0 16px;
    padding-left: 48px;
    background: ${(props) => props.theme.colors.cover2};
    ${(props) => props.theme.breakpoints.down('lg')} {
      padding-left: 32px;
    }

    .tableHeader {
      position: absolute;
      top: 0;
      left: 0;
      width: 65%;
      height: 100%;
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      min-height: 32px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }

    div.item {
      padding: 4px;

      &.widthLong {
        width: 22%;
      }
      &.widthshort {
        width: 17%;
      }

      &:first-of-type {
        padding-left: 0;
      }
      &:last-of-type {
        padding-right: 16px;
        text-align: right;
      }

      ${(props) => props.theme.breakpoints.down('lg')} {
        &.widthLong {
          width: 30%;
        }
        &.widthshort {
          width: 20%;
        }
      }
    }
  }
`;
const Items = styled.div`
  position: relative;
  z-index: 1;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
  position: relative;

  &:last-of-type {
    padding-bottom: 0;
  }
`;

const ItemStatus = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.colors.cover16};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28px;
  position: relative;
  z-index: 1;

  &:before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.colors.cover2};
    border-radius: 20px;
    content: '';
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &.active {
    color: ${(props) => props.theme.colors.primary};
    border: 1px solid ${(props) => props.theme.colors.primary};
  }
  &.done {
    color: ${(props) => props.theme.colors.icon};
    border: none;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-right: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 12px;
  }
`;

const ItemContent = styled.div`
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  font-weight: 400;
  font-size: 14px;
  font-style: normal;
  line-height: 130%;
  flex: 1;

  &.active {
    color: ${(props) => props.theme.colors.text};
  }

  div.item {
    padding: 5px 4px;

    &.widthLong {
      width: 22%;
    }
    &.widthshort {
      width: 17%;
    }

    &:first-of-type {
      padding-left: 0;
    }
    &:last-of-type {
      padding-right: 16px;
      text-align: right;
    }

    ${(props) => props.theme.breakpoints.down('lg')} {
      &.widthLong {
        width: 30%;
      }
      &.widthshort {
        width: 20%;
      }
    }
  }
`;
const H5ItemContent = styled.div`
  border-radius: 16px;
  padding: 12px;
  background: ${(props) => props.theme.colors.cover2};
  width: 100%;
  position: relative;
  z-index: 1;
  flex: 1;

  div.item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 8px;

    .label {
      width: 40%;
      margin-right: 8px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }

    .value {
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      text-align: right;
    }

    &:first-of-type {
      margin-top: 10px;
    }
  }

  .dateItem {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 500;
    font-size: 13px;
    font-style: normal;
    line-height: 130%;
  }

  .mark {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    min-width: 50px;
    height: 24px;
    padding: 4px 8px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    background: ${(props) => props.theme.colors.cover2};
    border-radius: 0px 16px;
    &.active {
      color: ${(props) => props.theme.colors.primary};
      background: ${(props) => props.theme.colors.primary8};
    }
  }
`;

const ItemLine = styled.div`
  position: absolute;
  width: 0;
  height: 100%;
  left: 10px;
  top: 50%;
  border-left: 1px dashed ${(props) => props.theme.colors.icon40};
  &.active {
    height: 100%;
    ${(props) => props.theme.breakpoints.down('sm')} {
      height: 50%;
      margin-top: 8px;
    }
  }
  &.done {
    border-left: 1px solid ${(props) => props.theme.colors.icon40};
  }
`;

const StatusTextWrapper = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;

const ExpandWrapper = styled.div`
  color: ${(props) => props.theme.colors.primary};
  margin-top: 24px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  img {
    width: 16px;
    height: 16px;
    margin-left: 4px;

    &.open {
      transform: rotateX(190deg);
    }
  }
`;

const PlaceholderText = styled.span`
  color: ${(props) => props.theme.colors.text40};
`;

const dateTimeFormatTransform = (startTime, endTime, lang) => {
  return `${
    startTime
      ? dateTimeFormat({
          date: +startTime,
          lang,
          options: { second: undefined, year: undefined },
        })
      : '--'
  } -  ${
    endTime
      ? dateTimeFormat({
          date: +endTime,
          lang,
          options: { second: undefined, year: undefined },
        })
      : '--'
  }`;
};

const StatusText = memo(({ activeStatus }) => {
  const statusText = useMemo(() => {
    if (activeStatus === 0) {
      return _t('4168c02542864000a190');
    } else if (activeStatus < 3) {
      return _t('7a3e33de89df4000aad5');
    } else if (activeStatus === 3) {
      return _t('9340b7f13a9e4000a161');
    } else {
      return _t('56973c1c54404000aca6');
    }
  }, [activeStatus]);

  return <StatusTextWrapper>{statusText}</StatusTextWrapper>;
});

const ProcessList = ({ list, activeIndex, activeStatus }) => {
  const { currentLang } = useLocale();
  const { sm, lg } = useResponsive();
  const [open, setOpen] = useState(false);

  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const pageId = get(pageData, 'id');
  const tokePath = get(pageData, 'token_path');
  const { baseCurrencyName: currencyFullName } = useSelector(
    (state) => state.spotlight7.detailInfo,
    shallowEqual,
  );

  const getClassName = useCallback(
    (index) => {
      let className = '';
      if (index < activeIndex) {
        className = 'done';
      } else if (index === activeIndex) {
        className = 'active';
      }
      return className;
    },
    [activeIndex],
  );

  const getStatusText = useCallback((type, status) => {
    if (type === 'done') {
      return status !== 2 ? _t('1d5efc504ebb4000a41a') : _t('56973c1c54404000aca6');
    } else {
      return _t('5837dff6ab6a4000a422');
    }
  }, []);

  const showList = useMemo(() => {
    if (open) {
      return list;
    } else if (activeIndex === 0) {
      return (list || []).slice(0, 3);
    } else if (activeIndex >= list?.length - 1) {
      return (list || []).slice(-3);
    } else {
      return (list || []).slice(activeIndex - 1, activeIndex + 2);
    }
  }, [list, activeIndex, open]);

  return (
    <Wrapper>
      <img src={processLeftTop} alt="icon" className="leftTopIcon" />
      <img src={processLeftBottom} alt="icon" className="leftBottomIcon" />
      <img src={processRightBottom} alt="icon" className="rightIcon" />
      <div className="titleWrapper">
        <div className="title">
          <img src={datebook} alt="logo" />
          {_t('3c6f70029edf4000a634', { num: list?.length || '0' })}
        </div>
        {sm && (
          <Button
            startIcon={<ICWaitOutlined size={16} />}
            variant="outlined"
            onClick={() =>
              locateToUrl(`/spotlight7/purchase-record/${tokePath?.trim() || pageId}`)
            }
          >
            {_t('a5bb60195ae04000a1b6')}
          </Button>
        )}
      </div>
      <ItemsWrapper>
        {sm && (
          <div className="header">
            <img src={tableHeader} alt="icon" className="tableHeader" />
            <div className="content">
              {lg ? (
                <>
                  <div className="item widthLong">{_t('3839c6ace7204000a12f')}</div>
                  <div className="item widthLong">{_t('4d0375cb59004000ac9e')}</div>
                </>
              ) : (
                <div className="item widthLong">{`${_t('3839c6ace7204000a12f')}/${_t(
                  '4d0375cb59004000ac9e',
                )}`}</div>
              )}
              <div className="item widthLong">{_t('b7790c02b4864000ace6')}</div>
              <div className="item widthshort">{_t('5f7e2c2236f34000a59e')}</div>
              <div className="item widthshort">{_t('23e1b860074a4000a43a')}</div>
            </div>
          </div>
        )}
        <Items>
          {map(
            showList,
            (
              {
                price,
                subAmount,
                status,
                periodicStartAt,
                periodicEndAt,
                subStartAt,
                subEndAt,
                idx,
              },
              index,
            ) => {
              const _className = getClassName(idx);

              const statusComp = (
                <ItemStatus className={_className}>
                  {idx >= activeIndex ? idx + 1 : <ICSuccessOutlined />}
                </ItemStatus>
              );

              return (
                <Item key={`proccessItem_${index}`}>
                  {index < showList.length - 1 ? <ItemLine className={`${_className}`} /> : null}
                  {statusComp}
                  {sm ? (
                    <ItemContent className={_className}>
                      {lg ? (
                        <>
                          <div className="item widthLong">
                            {dateTimeFormatTransform(periodicStartAt, periodicEndAt, currentLang)}
                          </div>
                          <div className="item widthLong">
                            {dateTimeFormatTransform(subStartAt, subEndAt, currentLang)}
                          </div>
                        </>
                      ) : (
                        <div className="item widthLong">
                          <div>
                            {dateTimeFormatTransform(periodicStartAt, periodicEndAt, currentLang)}
                          </div>
                          <div>{dateTimeFormatTransform(subStartAt, subEndAt, currentLang)}</div>
                        </div>
                      )}
                      <div className="item widthLong">
                        {subAmount ? (
                          <NumberFormat lang={currentLang}>{subAmount}</NumberFormat>
                        ) : (
                          <PlaceholderText>--</PlaceholderText>
                        )}
                      </div>
                      <div className="item widthshort">
                        {price ? (
                          <NumberFormat lang={currentLang}>{price}</NumberFormat>
                        ) : (
                          <PlaceholderText>--</PlaceholderText>
                        )}
                      </div>
                      <div className="item widthshort">
                        {_className === 'active' ? (
                          <StatusText activeStatus={activeStatus} />
                        ) : (
                          getStatusText(_className, status)
                        )}
                      </div>
                    </ItemContent>
                  ) : (
                    <H5ItemContent>
                      <div className="mark">
                        {_className === 'active' ? (
                          <StatusText activeStatus={activeStatus} />
                        ) : (
                          getStatusText(_className, status)
                        )}
                      </div>
                      <div className={`dateItem ${_className}`}>
                        {dateTimeFormatTransform(periodicStartAt, periodicEndAt, currentLang)}
                      </div>

                      {!!_className && (
                        <>
                          <div className="item">
                            <div className="label">{_t('4d0375cb59004000ac9e')}</div>
                            <div className="value">
                              {dateTimeFormatTransform(subStartAt, subEndAt, currentLang)}
                            </div>
                          </div>
                          <div className="item">
                            <div className="label">{_t('b7790c02b4864000ace6')}</div>
                            <div className="value">
                              {subAmount ? (
                                <NumberFormat lang={currentLang}>{subAmount}</NumberFormat>
                              ) : (
                                <PlaceholderText>--</PlaceholderText>
                              )}
                            </div>
                          </div>
                          <div className="item">
                            <div className="label">{_t('5f7e2c2236f34000a59e')}</div>
                            <div className="value">
                              {price ? (
                                <NumberFormat lang={currentLang}>{price}</NumberFormat>
                              ) : (
                                <PlaceholderText>--</PlaceholderText>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </H5ItemContent>
                  )}
                </Item>
              );
            },
          )}
        </Items>
        {list?.length - 3 > 0 ? (
          <ExpandWrapper>
            <div
              className="btn"
              role="button"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open
                ? _t('fe5e8254444e4000ae11')
                : _t('f8292d41c8eb4000a93f', { num: list?.length - 3 })}
              <img src={downSvg} alt="downSvg" className={open ? 'open' : ''} />
            </div>
          </ExpandWrapper>
        ) : null}
      </ItemsWrapper>
    </Wrapper>
  );
};

export default ProcessList;
