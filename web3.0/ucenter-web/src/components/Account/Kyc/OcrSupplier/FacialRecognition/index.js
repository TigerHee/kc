/**
 * Owner: Lena@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import { Button, styled, useResponsive, useSnackbar } from '@kux/mui';
import BaseDescription from 'components/Account/Kyc3/Home/KycStatusCard/components/Description';
import { map } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLegoAdvanceUrl } from 'services/kyc';
import { _t } from 'src/tools/i18n';
import MobileIcon from 'static/account/kyc/facial_m.svg';
import PcIcon from 'static/account/kyc/facial_pc.svg';
import InprocessIcon from 'static/account/kyc/inprocess_pc.svg';
import { getAllLocaleMap } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import siteConfig from 'utils/siteConfig';

const KUCOIN_HOST = siteConfig.KUCOIN_HOST;

const Wrapper = styled.div``;
const ContentWrapper = styled.div`
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-color: transparent transparent;
  scrollbar-track-color: transparent;
  -ms-scrollbar-track-color: transparent;
`;
const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const Item = styled.div`
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.divider8};
  &:first-of-type {
    margin-top: 24px;
  }
`;
const TypeImg = styled.img`
  width: 60px;
  height: 42px;
  flex-shrink: 0;
  margin-right: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 12px;
  }
`;
const Content = styled.div`
  flex: 1;
`;
const ContentTitle = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-weight: 500;
    font-size: 14px;
  }
`;
const ContentDesc = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  word-wrap: break-word;
  margin-bottom: 0;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const SelectIcon = styled(ICSuccessFilled)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const UnSelectIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.icon40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
const BtnWrapper = styled.div`
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
  .KuxButton-root {
    &:last-of-type {
      min-width: 160px;
    }
  }
`;
const PreButton = styled(Button)`
  color: ${(props) => props.theme.colors.text60};
  margin-right: 24px;
`;
const H5Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
`;
const H5Img = styled.img`
  width: 164px;
  margin-bottom: 24px;
`;
const H5Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.text};
`;
const H5Desc = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;
const RewardDesc = styled(BaseDescription)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
  span {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const FacialRecognition = ({ onOk }) => {
  const [selectedType, setSelectedType] = useState('');
  const { message } = useSnackbar();
  const list = [
    {
      title: _t('kbf1dJtu5F6VAEajnwz8cc'),
      desc: _t('aXHzDMusoKt6a6YbQe39ST'),
      img: PcIcon,
      type: 'pc',
    },
    {
      title: _t('hRmnkAfFAKm2YXNHpCExHy'),
      desc: _t('qQxZNeBNP1wNGR2fKtS8Zr'),
      img: MobileIcon,
      type: 'mobile',
    },
  ];
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const { kyc2ChannelInfo, rewardInfo, legoType, photoType } = useSelector((state) => state.kyc);

  const alllanguage = getAllLocaleMap() || {};
  const language = currentLang === window._DEFAULT_LANG_ ? '' : `/${alllanguage[currentLang]}`;
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const rewardMessage = useMemo(() => {
    if (['KYC', 'OLD_KYC'].includes(rewardInfo?.taskType)) {
      return rewardInfo?.taskSubTitle;
    }
    return '';
  }, [rewardInfo]);

  const onClick = async () => {
    setLoading(true);
    try {
      // pc扫脸，成功->kyc首页弹出倒计时，失败->失败页面
      // 手机扫码后，h5扫脸，成功->advacne扫脸结果成功页面，失败->advacne扫脸结果失败页面
      const isOpenNew = selectedType === 'pc' || isH5;

      const _ekycFlowId = kyc2ChannelInfo?.ekycflowId;
      const from = 'legoAdvanceResult';

      const returnUrl = `${KUCOIN_HOST}${language}/account/kyc`;

      const { success, data } = await getLegoAdvanceUrl({
        returnUrl: returnUrl,
        failedReturnUrl: returnUrl,
        ekycFlowId: _ekycFlowId,
      });
      setLoading(false);
      trackClick(['FaceMethodContinue', isOpenNew ? '1' : '2']);
      dispatch({
        type: 'kyc/update',
        payload: { advanceFrom: from, advanceEkycFlowId: _ekycFlowId, isCurrentDevice: isOpenNew },
      });

      if (success && data?.url) {
        if (isOpenNew) {
          onOk(
            'advanceIframe',
            `${data.url}&language=${currentLang}&isLivenessIframe=true`,
            data?.expireSecond,
          );
        } else if (selectedType === 'mobile') {
          onOk('facial_qrcode', `${data.url}&language=${currentLang}`, data?.expireSecond);
        }
      }
    } catch (error) {
      setLoading(false);
      const msg = error?.msg
        ? typeof error?.msg === 'string'
          ? error?.msg
          : 'error'
        : typeof error === 'string'
        ? error
        : 'error';
      message.error(msg);
    }
  };

  useEffect(() => {
    setDisabled(!selectedType);
  }, [selectedType]);

  useEffect(() => {
    saTrackForBiz({}, ['FaceMethod', '']);
  }, []);

  return (
    <Wrapper>
      {isH5 ? (
        <H5Content>
          <H5Img src={InprocessIcon} alt="inprocess-icon" />
          <H5Title>{_t('52cpZNpqXFboyTrGC43iAJ')}</H5Title>
          <H5Desc>{_t('kyc_step3_desc')}</H5Desc>
          {rewardMessage ? <RewardDesc>{rewardMessage}</RewardDesc> : null}
        </H5Content>
      ) : (
        <ContentWrapper>
          <Title>{_t('kyc_step3_choose')}</Title>
          <Desc>{_t('kyc_step3_desc')}</Desc>
          {rewardMessage ? <RewardDesc>{rewardMessage}</RewardDesc> : null}
          {map(list, (item) => {
            return (
              <Item
                key={item.type}
                onClick={() => {
                  setSelectedType(item.type === selectedType ? '' : item.type);
                  trackClick(['FaceMethodChoseDevice', item.type === 'pc' ? '1' : '2']);
                }}
              >
                <TypeImg src={item.img} />
                <Content>
                  <ContentTitle>{item.title}</ContentTitle>
                  <ContentDesc>{item.desc}</ContentDesc>
                </Content>
                {item.type === selectedType ? <SelectIcon /> : <UnSelectIcon />}
              </Item>
            );
          })}
        </ContentWrapper>
      )}

      <BtnWrapper>
        <PreButton
          onClick={() => {
            onOk(legoType ? 'legoCamera' : 'legoIndex');
            dispatch({
              type: 'kyc/update',
              payload: {
                legoCameraStep: photoType === 'back' ? 'backPhoto' : 'frontPhoto',
                showCamera: true,
              },
            });
          }}
          loading={loading}
          type="default"
          variant="text"
        >
          <span>{_t('jcrNiqR1ykWLB4AZF9igRS')}</span>
        </PreButton>
        <Button disabled={disabled && !isH5} onClick={onClick} loading={loading}>
          <span>{_t('1uQj2nEFstsPBLTJqNQRV9')}</span>
        </Button>
      </BtnWrapper>
    </Wrapper>
  );
};
export default FacialRecognition;
