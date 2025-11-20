/**
 * Owner: jesse@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kufox/mui';
import { formatLocalLangNumber } from 'helper';

import { useSelector } from 'src/hooks/useSelector';
import { _tHTML } from 'src/tools/i18n';

import bg from 'static/root/download/ueo/icon3.svg';

const HeaderImg = styled.img`
  width: 98px;
  height: 65px;
`;

const Wrap = styled.div`
  color: rgba(0, 13, 29, 0.68);
  /* color: ${(props) => props.theme.colors.text68}; */
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  width: 100%;
  min-height: 89px;
  justify-content: space-between;

  background: linear-gradient(
    93.09deg,
    rgba(190, 255, 196, 0.4) 5.19%,
    rgba(104, 236, 200, 0.4) 49.3%,
    rgba(108, 238, 203, 0.4) 61.15%,
    rgba(126, 239, 192, 0.4) 83.61%
  );
  border-radius: 12px;
`;

const Left = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text68};

  > span > span {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
  }
`;

export default ({}) => {
  const { KuRewardsConfig } = useSelector((state) => state.newhomepage); // 福利中心配置
  const { currentLang } = useLocale();

  return (
    <Wrap className="StaticBannerOfDrawer">
      <Left>
        {_tHTML('pbZh1HEjkB76xECJiCojd6', {
          num: formatLocalLangNumber({
            data: KuRewardsConfig?.totalRewardAmountNum,
            lang: currentLang,
            interceptDigits: 2,
          }),

          currency: 'USDT',
        })}
      </Left>
      <HeaderImg src={bg} />
    </Wrap>
  );
};
