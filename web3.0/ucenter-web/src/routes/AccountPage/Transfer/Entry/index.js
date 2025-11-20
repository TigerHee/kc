/**
 * Owner: eli@kupotech.com
 */
import styled from '@emotion/styled';
import { ICHookOutlined, ICInfoOutlined } from '@kux/icons';
import { Alert, Button, Checkbox, useResponsive, useTheme } from '@kux/mui';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import JsBridge from '@knb/native-bridge';
import { useDispatch } from 'react-redux';
import { _t, _tHTML } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { ReactComponent as AssetsRight } from 'static/account/transfer/asset-right.svg';
import { ReactComponent as dataExplanation } from 'static/account/transfer/data-explanation.svg';
import { handleATagClick } from '../utils/element';
import { useMessageErr } from '../utils/message';
import { polling } from '../utils/polling';
import { isAu } from '../utils/site';
import BlockDialog from './BlockDialog';
import { LINK_TYPE } from './constants';
import NetErrorDialog from './NetErrorDialog';
import {
  batchFetchBlockingInfo,
  blockingsInfoToState,
  checkBlockingInfo,
  getLinkURL,
} from './utils';

const Container = styled.div`
  max-width: 580px;
  border-radius: 12px;
  margin: 0 auto;
  padding: 32px 0 0 0;
  span {
    line-height: 140%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
    font-size: 20px;
  }
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 28px;
  line-height: 140%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
  }
`;

const Card = styled.div`
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px;
  }
`;

const ListCard = styled.div`
  display: flex;
  flex-direction: column;
  /* &:not(:first-child) { */
  &:not(:first-of-type) {
    margin-top: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
`;

const CardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const ListTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const StyledAssetsRight = styled(AssetsRight)`
  width: 20px;
  height: 20px;
  path {
    fill: ${({ theme }) => theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 18px;
    height: 18px;
  }
`;

const DataExplanation = styled(dataExplanation)`
  width: 20px;
  height: 20px;
  path {
    fill: ${({ theme }) => theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 18px;
    height: 18px;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: disc;
  font-size: 14px;
`;

const DotList = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  gap: 8px;
  list-style-type: disc;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 6px;
  }
`;

const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: disc;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 6px;
  }
`;

const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const ItemBox = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const DotListItem = styled(ListItem)`
  display: list-item;
  list-style-type: disc;
  font-size: 14px;
  &::marker {
    color: ${({ theme }) => theme.colors.text30};
  }
`;

const ListText = styled.span`
  color: ${({ theme }) => theme.colors.text60};
  flex: 1;
`;

const ListDesc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  margin: 10px 0 12px 0;
  display: flex;
  gap: 4px;

  svg {
    width: 16px;
    min-width: 16px;
    height: 16px;
    min-height: 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 6px 0 8px 0;
    svg {
      width: 14px;
      min-width: 14px;
      height: 14px;
      min-height: 14px;
    }
  }
`;

const ListDescText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text40};
`;

const AgreementRow = styled.div`
  display: flex;
  align-items: center;
  margin: 40px 0 24px 0;
  font-size: 14px;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 32px 0 20px 0;
  }
  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const ConfirmButton = styled(Button)`
  width: 100%;
`;

const HelperLinks = styled.div`
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  gap: 24px;
  color: ${({ theme }) => theme.colors.text60};
  margin: 24px 0;
  a {
    color: ${({ theme }) => theme.colors.text60};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const AlertWrapper = styled.div`
  margin-top: 10px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;

export default function TransferEntry({ onConfirm }) {
  const theme = useTheme();

  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const dispatch = useDispatch();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);

  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openNetErrorDialog, setOpenNetErrorDialog] = useState(false);
  const ref = createRef(null);
  const timer = useRef(null);

  // 迁移阻止项弹窗信息
  const [accountBlockingInfo, setAccountBlockingInfo] = useState([]);
  const [financialBlockingInfo, setFinancialBlockingInfo] = useState([]);
  const [assetBlockingInfo, setAssetBlockingInfo] = useState([]);
  const [tradeBlockingInfo, setTradeBlockingInfo] = useState([]);
  const [fiatBlockingInfo, setFiatBlockingInfo] = useState([]);
  const [cryptoBlockingInfo, setCryptoBlockingInfo] = useState([]);
  // 补充信息
  const [replenishInfo, setReplenishInfo] = useState({});

  const msgError = useMessageErr();
  const CheckboxIcon = <ICHookOutlined size={14} color={theme.colors.primary} />;
  const InfoIcon = <ICInfoOutlined size={16} />;
  const targetSiteType = userTransferInfo?.targetSiteType;
  const targetSiteName = getSiteName(targetSiteType);
  // KYC,KYB是否奥地利
  const isAT = userTransferInfo?.kycRegion === 'AT';

  const AllReserveList = [
    {
      text: _t('e47046919e3c4800a975', { targetSiteName }),
      icon: CheckboxIcon,
      desc: _t('2162bc3882954800a99d'),
      descIcon: InfoIcon,
      isHide: !window._SITE_CONFIG_.functions.futures,
    },
    {
      text: _t('519abf00324a4800a5a2'),
      icon: CheckboxIcon,
    },
    {
      text: _t('9c90af7ecccd4800a23c'),
      icon: CheckboxIcon,
    },
    // {
    //   text: _t('b9a217b3725b4000a3a8'),
    //   icon: CheckboxIcon,
    //   isHide: !isAu(targetSiteType),
    // },
    {
      text: _t('4bb3e3393c0e4800a7d2'),
      icon: CheckboxIcon,
      isHide: !isAu(targetSiteType),
    },
    {
      text: _t('9a9224f986a04000ad3c'),
      icon: CheckboxIcon,
      isHide: !isAu(targetSiteType),
    },
    {
      text: _t('188ef45f83d14800a0b5', { targetSiteName }),
      icon: CheckboxIcon,
      // desc: `系统将自动赎回您当前持有的理财产品，并在「${targetSiteName}」站自动重新申购同款产品。您将在订单记录中看到一笔赎回与一笔申购记录，理财收益不受影响。`,
      desc: _t('e8dcace0b3464800a2dc', { targetSiteName }),
      descIcon: InfoIcon,
      isHide: !window._SITE_CONFIG_.functions.financing || isAu(targetSiteType),
    },
    {
      text: _t('96375c1d427e4800a60c'),
      icon: CheckboxIcon,
      desc: _t('7930b4ed14d44800a902', { targetSiteName }),
      descIcon: InfoIcon,
      isHide: !window._SITE_CONFIG_.functions.trading_bot,
    },
    {
      text: _t('3920df5862d74800aa1d'),
      icon: CheckboxIcon,
      desc: _t('5f967e8f3f074000a819', { targetSiteName }),
      descIcon: InfoIcon,
      isHide: !window._SITE_CONFIG_.functions.spot,
    },
    // {
    //   text: _t('dc023924e28d4800a4be', { targetSiteName }),
    //   icon: CheckboxIcon,
    // },
  ].filter((i) => !i.isHide);

  const cancelList = [
    {
      text: _t('c7a3a783da084800ab94'),
      isHide: !window._SITE_CONFIG_.functions.copy_trading,
    },
    {
      text: _t('8a57e880525b4800ab89'),
      isHide: !window._SITE_CONFIG_.functions.fast_trade,
    },
    {
      text: _t('763a1bbe04b44800a3a3'),
    },
    {
      text: _t('5a61730e53104800a123'),
      isHide: !window._SITE_CONFIG_.functions.activity_bench,
    },
    {
      text: _t('7147c434d1394000a7c4'),
      isHide: !window._SITE_CONFIG_.functions.kucard,
    },
  ].filter((i) => !i.isHide);

  const AccountDataList = [
    {
      text: _t('8d2dffc72f684000a043'),
    },
    {
      text: _t('05bcc58192f44800aeda'),
    },
  ];

  const KYCList = [
    {
      text: _t('2ea6cf79519a4000ad88', { targetSiteName }),
    },
  ];

  const ATNotSupportList = [
    {
      text: _t('580cd1c7f03a4000a072'),
    },
    {
      text: _t('6a06b182ea1b4000a258'),
    },
  ];

  const handleChange = () => {
    setChecked(!checked);
  };

  const getBlockingInfo = useCallback(async () => {
    try {
      const blockingInfos = await batchFetchBlockingInfo(userTransferInfo);
      const needBlock = checkBlockingInfo(blockingInfos);
      if (!needBlock) {
        onConfirm();
        return;
      }
      console.log('blockingInfos blockingInfos:', blockingInfos);
      const {
        accountBlockingInfo,
        financialBlockingInfo,
        assetBlockingInfo,
        tradeBlockingInfo,
        fiatBlockingInfo,
        cryptoBlockingInfo,
        kycBlockingInfo,
        userBindInfo,
      } = blockingsInfoToState(blockingInfos);
      console.log('accountBlockingInfo in TransferEntry:', accountBlockingInfo);
      setAccountBlockingInfo(accountBlockingInfo);
      setFinancialBlockingInfo(financialBlockingInfo);
      setAssetBlockingInfo(assetBlockingInfo);
      setTradeBlockingInfo(tradeBlockingInfo);
      setFiatBlockingInfo(fiatBlockingInfo);
      setCryptoBlockingInfo(cryptoBlockingInfo);
      setReplenishInfo({ kycBlockingInfo, userBindInfo });
      return needBlock;
    } catch (error) {
      setOpenNetErrorDialog(true);
      throw error;
    } finally {
      // 10秒倒计时
      dispatch({
        type: 'userTransfer/updateNextFetchBlockInfoTime',
        payload: { time: Date.now() + 10_000 },
      });
    }
  }, [onConfirm, userTransferInfo]);

  const handleConfirm = useCallback(async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      trackClick(['buttonNextStep', '1'], { targetSiteType });
      const needBlock = await getBlockingInfo();
      if (needBlock) setOpenBlockDialog(true);
    } catch (error) {
      msgError(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, targetSiteType, getBlockingInfo]);

  const handleNetErrorRetry = useCallback(async () => {
    setOpenNetErrorDialog(false);
    try {
      await getBlockingInfo();
    } catch (error) {
      msgError(error);
    }
  }, [getBlockingInfo]);

  const handleClose = () => {
    setOpenBlockDialog(false);
  };

  useEffect(() => {
    if (openBlockDialog) {
      try {
        timer.current = polling(getBlockingInfo);
      } catch (error) {
        msgError(error);
      }
    } else {
      if (timer.current) {
        timer.current?.();
      }
    }
    return () => {
      if (timer.current) {
        timer.current?.();
      }
    };
  }, [getBlockingInfo, openBlockDialog]);

  useEffect(() => {
    if (!userTransferInfo) {
      return;
    }
    const isApp = JsBridge.isApp();

    let elements = [];
    try {
      if (isApp) {
        elements = ref.current?.querySelectorAll('a');
        elements?.forEach?.((elem) => {
          elem?.addEventListener?.('click', handleATagClick);
        });
      }
    } catch (error) {
      console.error('show transfer click error:', error);
    }

    return () => {
      if (isApp) {
        elements?.forEach?.((elem) => {
          elem?.removeEventListener?.('click', handleATagClick);
        });
      }
    };
  }, [userTransferInfo]);

  return (
    <Container>
      <Title>{_t('8626b8b208ec4800a5c4', { targetSiteName })}</Title>
      <MultiSubTitle site={targetSiteType} />
      <Card isH5={isH5}>
        <CardTitle>
          <StyledAssetsRight />
          <span>{_t('ea6cd38a71834000a84e')}</span>
        </CardTitle>
        <ListCard>
          <ListTitle>{_t('5bcdb930514c4000ac37')}</ListTitle>
          <List>
            {AllReserveList.map((item) => (
              <ListItem key={item.text}>
                <div style={{ marginTop: 2 }}>{item.icon}</div>
                <ListText>
                  <span>{item.text}</span>
                  {item.desc && (
                    <ListDesc>
                      {item.descIcon}
                      <ListDescText>{item.desc}</ListDescText>
                    </ListDesc>
                  )}
                </ListText>
              </ListItem>
            ))}
          </List>
        </ListCard>
        <ListCard>
          <ListTitle>{_t('30c1426025084000a81b')}</ListTitle>
          <DotList>
            {cancelList.map((item) => (
              <DotListItem key={item.text}>
                <ListText>{item.text}</ListText>
              </DotListItem>
            ))}
          </DotList>
        </ListCard>
      </Card>
      <Card>
        <CardTitle>
          <DataExplanation />
          <span>{_t('24bd64c5ae2f4800a7a2')}</span>
        </CardTitle>
        <ListCard>
          <ListTitle>{_t('30d2365d63724800acd9')}</ListTitle>
          <DotList>
            {AccountDataList.map((item) => (
              <DotListItem key={item.text}>
                <ListText>{item.text}</ListText>
              </DotListItem>
            ))}
          </DotList>
        </ListCard>
        <ListCard>
          <ListTitle>{_t('8333895c2eab4000aa1e')}</ListTitle>
          <ListBox>
            {KYCList.map((item) => (
              <ItemBox key={item.text}>
                <ListText>{item.text}</ListText>
              </ItemBox>
            ))}
          </ListBox>
        </ListCard>

        <AlertWrapper>
          <Alert
            showIcon
            type="info"
            title={
              <div style={{ marginTop: 2, fontSize: 12, fontWeight: 400 }}>
                {_t('d1ea0c7f36f24000a5a6')}
              </div>
            }
          />
        </AlertWrapper>

        {isAT ? (
          <ListCard>
            <ListTitle>{_t('db0ac60923524000a1a8')}</ListTitle>
            <DotList>
              {ATNotSupportList.map((item) => (
                <DotListItem key={item.text}>
                  <ListText>{item.text}</ListText>
                </DotListItem>
              ))}
            </DotList>
          </ListCard>
        ) : null}
      </Card>
      <AgreementRow>
        <Checkbox id="agree" checked={checked} onChange={handleChange} size="small" />
        <div ref={ref}>
          <span>
            {_tHTML('03b1544578014000af7c', {
              targetSiteName,
              termsLink: getLinkURL(LINK_TYPE.TERMS, targetSiteType),
              privacyLink: getLinkURL(LINK_TYPE.PRIVACY, targetSiteType),
            })}
          </span>
        </div>
      </AgreementRow>
      <ConfirmButton loading={isLoading} disabled={!checked} onClick={handleConfirm}>
        {_t('confirm')}
      </ConfirmButton>
      <HelperLinks>
        <a
          href={getLinkURL(LINK_TYPE.GUIDE, targetSiteType)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            trackClick(['linkGuide', '1'], { targetSiteType });
            handleATagClick(e);
          }}
        >
          {_t('5838fd65cc5d4000a230')}
        </a>
      </HelperLinks>
      <BlockDialog
        accountBlockingInfo={accountBlockingInfo}
        financialBlockingInfo={financialBlockingInfo}
        assetBlockingInfo={assetBlockingInfo}
        tradeBlockingInfo={tradeBlockingInfo}
        fiatBlockingInfo={fiatBlockingInfo}
        cryptoBlockingInfo={cryptoBlockingInfo}
        open={openBlockDialog}
        onClose={handleClose}
        replenishInfo={replenishInfo}
      />
      <NetErrorDialog
        open={openNetErrorDialog}
        onCancel={() => setOpenNetErrorDialog(false)}
        onRetry={handleNetErrorRetry}
      />
    </Container>
  );
}

const MultiSubTitle = ({ site }) => {
  if (isAu(site)) {
    return (
      <SubTitle>
        <div>
          <div style={{ marginBottom: 28 }}>{_t('16276bd5ff224000ad29')}</div>
          <div>{_t('0aeb7b3358144000a7d7')}</div>
        </div>
      </SubTitle>
    );
  }
  return <SubTitle>{_t('2a02ea07f6d64800a8e9')}</SubTitle>;
};
