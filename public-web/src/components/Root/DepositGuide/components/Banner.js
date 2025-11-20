/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, styled } from '@kufox/mui';
import { useEffect } from 'react';
import { _t, _tHTML } from 'src/tools/i18n';
import close from 'static/root/deposit/close.svg';
// import icon from 'static/root/deposit/icon_desposit.svg';
import { formatLocalLangNumber } from 'helper';

import { useSelector } from 'src/hooks/useSelector';
import { saTrackForBiz } from 'src/utils/ga';
import icon from 'static/root/download/ueo/icon1.svg';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 80px;
  position: relative;
  padding: 0 16px;
  z-index: 2;
  /* background: rgba(45, 189, 150, 0.12); */
  background: #ebfaf6;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  margin-right: 12px;
`;

const IconWrapper = styled(Centered)`
  margin-right: 6px;
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 130%;
  /* color: ${({ theme }) => theme.colors.text}; */
  color: ${(props) => props.theme.colors.text68};
  span span {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const CloseBtn = styled.img`
  width: 12px;
  height: 12px;
  position: absolute;
  left: 8px;
  top: 8px;
`;

const WrapBtn = styled(Button)`
  min-width: 64px;
`;

export default ({ onCloseBanner, onClickBanner }) => {
  const { KuRewardsConfig } = useSelector((state) => state.newhomepage); // 福利中心配置
  const { currentLang } = useLocale();

  useEffect(() => {
    try {
      saTrackForBiz({}, ['depositGuideBanner', '1'], {});
    } catch (error) {}
  }, []);

  return (
    <Wrapper onClick={onClickBanner} className="deposit-banner">
      <Left>
        <IconWrapper>
          <Icon src={icon} />
        </IconWrapper>
        <Centered>
          <Text>
            {_tHTML('pbZh1HEjkB76xECJiCojd6', {
              num: formatLocalLangNumber({
                data: KuRewardsConfig?.totalRewardAmountNum,
                lang: currentLang,
                interceptDigits: 2,
              }),
              currency: 'USDT',
            })}
          </Text>
        </Centered>
      </Left>
      <Centered>
        <WrapBtn size="small">{_t('nCqWYdrwP4MgE5MSaozEA6')}</WrapBtn>
      </Centered>
      <CloseBtn src={close} onClick={onCloseBanner} />
    </Wrapper>
  );
};
