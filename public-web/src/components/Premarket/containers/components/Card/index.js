/**
 * Owner: solar.xia@kupotech.com
 */
import tdkManager from '@kc/tdk';
import { useLocale } from '@kucoin-base/i18n';
import { ICRewardsHubOutlined, ICShareOutlined } from '@kux/icons';
import { Button, Dialog, Divider, Tag, ThemeProvider, useSnackbar, useTheme } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { startsWith } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { shallowEqual } from 'react-redux';
import { getTdkConfig } from 'services/tdk';
import LazyImg from 'src/components/common/LazyImg';
import NumberFormat from 'src/components/common/NumberFormat';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import copy from 'static/aptp/copy-tag.svg';
import link from 'static/aptp/link-tag.svg';
import { addLangToPath, _t } from 'tools/i18n';
import { IS_SSG_ENV } from 'utils/ssgTools';
import { getTDKFromHtml } from 'utils/tdk';
import { Modal, Tooltip } from '../../../components';
import { useActivityStatus, useProcessPercentage, useResponsiveSize } from '../../../hooks';

import { MoreButton } from '../MoreButton';
import {
  NavTags,
  StyledCard,
  StyledCardSection,
  StyledCardSectionModal,
  StyledFeeDialogBody,
  StyledToolTipContent,
} from './styledComponents';

const { KUCOIN_HOST_COM } = siteCfg;

const WrapperToolTip = ({ title, children }) => {
  return (
    <Tooltip title={title}>
      <StyledToolTipContent>{children}</StyledToolTipContent>
    </Tooltip>
  );
};

const getNewTdk = (title = '', description = '', keyword = '', name, shortName) => {
  const fullNameReg = new RegExp(/\{1\}/, 'g');
  const shortNameReg = new RegExp(/\{0\}/, 'g');
  let newTitle = title.replace(fullNameReg, name);
  newTitle = newTitle.replace(shortNameReg, shortName);
  let newDes = description.replace(fullNameReg, name);
  newDes = newDes.replace(shortNameReg, shortName);
  let newKey = keyword.replace(fullNameReg, name);
  newKey = newKey.replace(shortNameReg, shortName);
  return {
    title: newTitle,
    description: newDes,
    keywords: newKey,
  };
};

function SupplyInfo({ maximumSupply, isSm }) {
  return (
    +maximumSupply > 0 && (
      <div className="supply-info">
        <div className="supply-item">
          <div className="label">
            <WrapperToolTip title={_t('8bec918b6bc94000ab75')}>
              {_t('83c3c34f32664000aa70')}
            </WrapperToolTip>
          </div>
          <div className="value">
            <NumberFormat>{maximumSupply}</NumberFormat>
          </div>
        </div>
        {isSm && <Divider />}
      </div>
    )
  );
}

function CardSection({ expanded = false }) {
  const theme = useTheme();
  const [detailVisible, setDetailVisible] = useState(false);
  const { introDetail, websiteLink, logo, fullName, shortName, id, maximumSupply } = useSelector(
    (state) => state.aptp.deliveryCurrencyInfo,
    shallowEqual,
  );
  const { message } = useSnackbar();
  const size = useResponsiveSize();
  const activityStatus = useActivityStatus();
  const appInfo = useSelector((state) => state.app.appInfo, shallowEqual);
  const { webHost } = appInfo || {};
  const referralCode = useSelector((state) => state.user.referralCode, shallowEqual);
  const shareLink = useMemo(() => {
    let shareHost = KUCOIN_HOST_COM;
    if (webHost) {
      shareHost = startsWith(webHost, 'https') ? webHost : `https://${webHost}`;
    }
    return addLangToPath(`${shareHost}/r/rf/${referralCode}`);
  }, [referralCode, webHost]);
  // 防止app内用户点击多次，弹出多次弹框
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const handleShare = useCallback(
  //   debounce(
  //     () => {
  //       if (!user) {
  //         return skip2Login();
  //       }
  //       dispatch({
  //         type: 'aptp/update',
  //         payload: {
  //           shareInfo: {
  //             shareImg:
  //               'https://assets.staticimg.com/cms/media/91zowLswIOgKP3q1MjmGWeQOC5GVdu2ApdLWPwlB0.jpg',
  //           },
  //           shareModal: Math.random(),
  //         },
  //       });
  //     },
  //     2000,
  //     { trailing: false, leading: true },
  //   ),
  //   [dispatch],
  // );
  const isH5 = size === 'sm';
  const StatusLabel = [
    _t('a41d4495e7024000a642'),
    _t('6062bed4b3b34000a5a8'),
    _t('f1161fe89e3e4000ac4b'),
    _t('cc4d141c536e4000a9d2'),
  ];
  const isSm = size === 'sm';
  // expanded true 为弹窗 false 为正常展示
  return (
    <StyledCardSection expanded={expanded}>
      {logo && <LazyImg src={`${logo}?d=160x160`} alt="logo" />}

      <div className="title-container">
        <div className="title-wrapper">
          <div className="nameInfo">
            <h1 className="shortName">{shortName}</h1>
            <div className="fullName">{fullName}</div>
          </div>

          {id && (
            <div className="tag">
              <Tag
                color={
                  activityStatus === 0
                    ? 'complementary'
                    : activityStatus === 1
                    ? 'primary'
                    : 'default'
                }
              >
                {StatusLabel[activityStatus]}
              </Tag>
            </div>
          )}
        </div>
        {expanded && (
          <NavTags omitTag={expanded || size === 'sm'}>
            {websiteLink && (
              <li>
                <img src={link} alt="" width={12} height={12} />
                <div>{websiteLink}</div>
                <CopyToClipboard
                  text={websiteLink}
                  onCopy={() => {
                    message.success(_t('copy.succeed'));
                  }}
                >
                  <img src={copy} alt="" width={12} height={12} />
                </CopyToClipboard>
              </li>
            )}
          </NavTags>
        )}
        {!expanded && (
          <div className="action-buttons">
            {isH5 ? (
              <ICRewardsHubOutlined
                size={20}
                onClick={() => {
                  setDetailVisible(true);
                }}
                color={theme.colors.text}
              />
            ) : (
              <Button
                className="action-button detail-btn"
                variant="outlined"
                startIcon={<ICRewardsHubOutlined size={12} />}
                size="small"
                onClick={() => {
                  setDetailVisible(true);
                }}
              >
                {_t('details')}
              </Button>
            )}

            {isH5 && <Divider type="vertical" />}

            {isH5 ? (
              <CopyToClipboard
                text={shareLink}
                onCopy={() => {
                  message.success(_t('copy.succeed'));
                }}
              >
                <ICShareOutlined size={20} color={theme.colors.text} />
              </CopyToClipboard>
            ) : (
              <CopyToClipboard
                text={shareLink}
                onCopy={() => {
                  message.success(_t('copy.succeed'));
                }}
              >
                <Button
                  className="action-button share-btn"
                  variant="outlined"
                  startIcon={<ICShareOutlined size={12} />}
                  size="small"
                  // onClick={handleShare}
                >
                  {_t('5d420a2591a54000ae9f')}
                </Button>
              </CopyToClipboard>
            )}
          </div>
        )}
        {!expanded && !isSm && <SupplyInfo {...{ maximumSupply, isSm }} />}
      </div>
      {!expanded && (
        <Modal
          open={detailVisible}
          onConfirm={() => {
            setDetailVisible(false);
          }}
          onClose={() => {
            setDetailVisible(false);
          }}
          title={_t('241hZKq2oLtswvDYKjBnMY')}
          hideFooter={size !== 'sm'}
          drawerHeightSize="md"
          hideCancelBtn
          okText={_t('u9QAZW6WNmKYHB6do1KwgQ')}
        >
          <StyledCardSectionModal>
            <CardSection expanded={true} />
            <main>
              <p>{introDetail || ''}</p>
            </main>
          </StyledCardSectionModal>
        </Modal>
      )}
    </StyledCardSection>
  );
}

export default function Card() {
  const {
    tradeStartAt,
    tradeEndAt,
    deliveryTime,
    pledgeRate,
    buyMakerFeeRate, // 买方maker费率
    buyTakerFeeRate, // 买方taker费率
    sellMakerFeeRate, // 卖方maker费率
    sellTakerFeeRate, // 卖方taker费率
    displayTradeEndAt,
    fullName,
    shortName,
    maximumSupply = 0,
  } = useSelector((state) => state.aptp.deliveryCurrencyInfo, shallowEqual);
  const size = useResponsiveSize();

  const pledgePercentage = useProcessPercentage(pledgeRate);
  const buyMakerFeeRatePercentage = useProcessPercentage(buyMakerFeeRate);
  const buyTakerFeeRatePercentage = useProcessPercentage(buyTakerFeeRate);
  const sellMakerFeeRatePercentage = useProcessPercentage(sellMakerFeeRate);
  const sellTakerFeeRatePercentage = useProcessPercentage(sellTakerFeeRate);
  const { currentLang, isRTL } = useLocale();
  const [feeDialogShow, setFeeDialogShow] = useState();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  useEffect(() => {
    if (shortName && (IS_SSG_ENV || !window._useSSG)) {
      getTdkConfig(currentLang).then((res) => {
        if (res && res.success && res.data) {
          const { title, description, keyword } = res.data;
          const name = fullName || shortName;
          const tdk = getNewTdk(title, description, keyword, name, shortName);
          //html中的tdk和 getNewTdk 不一致
          const htmlTdk = getTDKFromHtml();
          if (
            tdk.title !== htmlTdk.title ||
            tdk.description !== htmlTdk.description ||
            tdk.keywords !== htmlTdk.keywords
          ) {
            tdkManager.handleUpdateTdk(currentLang, tdk, true);
          }
        }
      });
    }
  }, [fullName, shortName, currentLang]);

  const isSm = size === 'sm';

  return (
    <StyledCard as="section">
      <div className="top-info">
        <CardSection />
        {isSm && <SupplyInfo {...{ maximumSupply, isSm }} />}
      </div>

      <div className="currency-detail">
        <div className="trade-info">
          <div className="trade-info-item">
            <div className="label">{_t('n27sNg1ZzL4wFyCKkiaDPV')}</div>
            <div className="value">
              {!isSm &&
                `${dateTimeFormat({
                  date: +tradeStartAt * 1000,
                  lang: currentLang,
                  options: { timeZone: 'UTC', second: undefined },
                })} - ${
                  displayTradeEndAt
                    ? dateTimeFormat({
                        date: +tradeEndAt * 1000,
                        lang: currentLang,
                        options: { timeZone: 'UTC', second: undefined },
                      })
                    : _t('fDfqjRaCNVa226rPjxEA5o')
                }${_t('wMm9D9jK8iibsKRZrPbiQ8')}`}
              {isSm && (
                <>
                  <div>
                    {`${isRTL ? '-' : ''}` +
                      dateTimeFormat({
                        date: +tradeStartAt * 1000,
                        lang: currentLang,
                        options: { timeZone: 'UTC', second: undefined },
                      })}
                    {' ' + `${isRTL ? _t('wMm9D9jK8iibsKRZrPbiQ8') : ''}`}
                  </div>
                  <div>
                    {displayTradeEndAt
                      ? dateTimeFormat({
                          date: +tradeEndAt * 1000,
                          lang: currentLang,
                          options: { timeZone: 'UTC', second: undefined },
                        })
                      : _t('fDfqjRaCNVa226rPjxEA5o')}
                    {isRTL ? '' : _t('wMm9D9jK8iibsKRZrPbiQ8')}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="trade-info-item">
            <div className="label">
              <WrapperToolTip title={_t('t7EJNr84t8f2PSdBDbRt5Y')}>
                {_t('i76HHGQ12BXie2WBaa5Uqo')}
              </WrapperToolTip>
            </div>
            <div className="value">
              {deliveryTime &&
                `${dateTimeFormat({
                  date: +deliveryTime * 1000,
                  lang: currentLang,
                  options: { timeZone: 'UTC', second: undefined },
                })}${_t('wMm9D9jK8iibsKRZrPbiQ8')}`}
              {!deliveryTime && <span className="unpublish">{_t('fDfqjRaCNVa226rPjxEA5o')}</span>}
            </div>
          </div>
          <div className="trade-info-item">
            <div className="label">
              <WrapperToolTip title={_t('aqFz4GFAq66pqKajMN5QC5')}>
                {_t('aBDU7DJ9KsWpYSLiXVhS9Q')}
              </WrapperToolTip>
            </div>
            <div className="value">{pledgePercentage}</div>
          </div>
          <div className="trade-info-item">
            <div className="label">
              <WrapperToolTip title={_t('8fHppFvWMzMwX2X98beWQj')}>
                {_t('atvdByFFTvFsmjGRDp4kik')}
              </WrapperToolTip>
            </div>
            <div>
              <MoreButton onClick={() => setFeeDialogShow(true)} />
            </div>
            <ThemeProvider theme={currentTheme}>
              <Dialog
                title={_t('atvdByFFTvFsmjGRDp4kik')}
                open={feeDialogShow}
                cancelText={null}
                onCancel={() => setFeeDialogShow(false)}
                onOk={() => setFeeDialogShow(false)}
                centeredFooterButton
                showCloseX={isSm ? false : true}
              >
                <StyledFeeDialogBody>
                  <div className="item">
                    <div className="label">{_t('666d326a168b4000a1af')}</div>
                    <div className="value">{buyTakerFeeRatePercentage}</div>
                  </div>
                  <div className="item">
                    <div className="label">{_t('649b81463bf14000a737')}</div>
                    <div className="value">{buyMakerFeeRatePercentage}</div>
                  </div>
                  <div className="item">
                    <div className="label">{_t('6ed46c691c454000adb5')}</div>
                    <div className="value">{sellTakerFeeRatePercentage}</div>
                  </div>
                  <div className="item">
                    <div className="label">{_t('fd319f1d42e04000a1f5')}</div>
                    <div className="value">{sellMakerFeeRatePercentage}</div>
                  </div>
                </StyledFeeDialogBody>
              </Dialog>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </StyledCard>
  );
}
