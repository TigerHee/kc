/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { useSelector } from 'src/hooks/useSelector';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import { SENSORS } from 'src/routes/SlothubPage/constant';
import { _t } from 'src/tools/i18n';
import { useStore } from '../../../store';
import { useOpenConvertCoin } from '../hooks/useOpenConvertCoin';
import { HorizontalCenterWrap, VerticalWrap } from './AtomComponents/styled';
import { ProcessData, ProcessDesc, ProcessDescItem } from './styled';
import TaskSubmitButton from './TaskSubmitButton';

const SubmitButton = ({ currency, isFinish }) => {
  const convert = useOpenConvertCoin();

  return (
    <TaskSubmitButton
      onPreClick={() => SENSORS.currencyExchange({ currency })}
      isFinish={isFinish}
      toLink={convert}
    >
      {_t('411ef09418054000a7e0')}
    </TaskSubmitButton>
  );
};

export const ExchangeTaskProcess = ({ currencyName }) => {
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const { state } = useStore();
  const { isLogin } = useSelector((state) => state.user);

  const { redemptionLimit, commonProjectPoints, currency } = state.projectDetail || {};

  const { remainingPoints } = userSummary || {};
  const isMatchMaxExchangeLimit =
    redemptionLimit !== 0 && commonProjectPoints >= redemptionLimit && isLogin;

  return (
    <VerticalWrap>
      <HorizontalCenterWrap>
        <ProcessDescItem>
          <ProcessData>{remainingPoints || 0}</ProcessData>
          <ProcessDesc>{_t('163ef36926564000a9ac')}</ProcessDesc>
        </ProcessDescItem>

        <ProcessDescItem>
          <ProcessData>
            <span className="green">
              <NumberFormat>{commonProjectPoints || 0}</NumberFormat>
            </span>
          </ProcessData>
          <ProcessDesc>{_t('9151c408be494000a846', { token: currencyName })}</ProcessDesc>
        </ProcessDescItem>

        <SubmitButton currency={currency} isFinish={isMatchMaxExchangeLimit} />
      </HorizontalCenterWrap>
    </VerticalWrap>
  );
};
