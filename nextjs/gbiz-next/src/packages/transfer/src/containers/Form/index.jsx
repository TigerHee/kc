/**
 * Owner: solar@kupotech.com
 */
import { useTranslation } from 'tools/i18n';
import { ICPriceFallOutlined } from '@kux/icons';
import { useTheme, Input } from '@kux/mui';
import clns from 'classnames';
import { useCallback, useState } from 'react';
import { useFormField } from '@transfer/hooks/fields';
import useUpdateLayoutEffect from '@transfer/hooks/useUpdateLayoutEffect';
import transferIcon from '@transfer/static/transfer-vertical.svg';
import BatchSwitch from './components/BatchSwitch';
import SeqDeduction from './components/SeqDeduction';
// import SavingsTip from './components/SavingsTip';
import { useForceFormFieldChange } from '../../hooks/fields';
import { TransferBox, StyledDivider, FormItem, StyledHiddenFormItemWrapper } from './style';
import PayAccountType from './Fields/PayAccountType';
import RecAccountType from './Fields/RecAccountType';
import Currencies from './Fields/Currencies';
import Amount from './Fields/Amount';
import ConfirmButton from './Fields/ConfirmButton';
import { exchangeItems } from '../../animate';
import Tips from '../Tips';
import { useStateFieldsDeps } from '../../hooks/deps';

function HiddenFormItem(props) {
  return (
    <StyledHiddenFormItemWrapper>
      <FormItem {...props}>
        <Input />
      </FormItem>
    </StyledHiddenFormItemWrapper>
  );
}

function ReverseButton() {
  const forceFormUpdate = useForceFormFieldChange();
  const payAccountType = useFormField('payAccountType');
  const [reverseLoading, setReverseLoading] = useState(false);
  const [reverseFlag, setReverseFlag] = useState({});
  const disabled = payAccountType === 'MULTI' || reverseLoading;
  const handleReverseClick = useCallback(async () => {
    if (disabled) return;
    setReverseLoading(true);
    await exchangeItems();
    setReverseLoading(false);
    setReverseFlag({});
  }, [disabled]);

  useUpdateLayoutEffect(() => {
    forceFormUpdate((fields) => {
      const { payAccountType, recAccountType, recTag, payTag } = fields;
      return {
        payAccountType: recAccountType,
        recAccountType: payAccountType,
        recTag: payTag,
        payTag: recTag,
      };
    });
  }, [reverseFlag]);

  return (
    <div
      className={clns('reverse', {
        disabled,
      })}
      data-inspector="change-direction"
      onClick={handleReverseClick}
    >
      <img alt="reverse-icon" width={20} height={46} src={transferIcon} />
    </div>
  );
}

/**
 * form维护以下fields
 * payAccountType from账户
 * recAccountType to账户
 * currency 划转币种(如果是批量划转，默认值为数组)
 * amount 数量
 */
export default function FormContent() {
  useStateFieldsDeps();
  const { t: _t } = useTranslation('transfer');

  const theme = useTheme();

  return (
    <>
      {/* <SavingsTip /> */}
      <TransferBox>
        <div className="direction">
          <div>{_t('convert.form.input.from.left.title')}</div>
          <div className="arrowBox">
            <ICPriceFallOutlined size="16" color={theme.colors.icon40} />
          </div>
          <div>{_t('convert.form.input.to.left.title')}</div>
        </div>
        <div className="account-container">
          <FormItem name="payAccountType" className="account-item">
            <PayAccountType />
          </FormItem>
          <StyledDivider />
          <FormItem name="recAccountType" className="account-item">
            <RecAccountType />
          </FormItem>
        </div>
        <ReverseButton />
      </TransferBox>
      <BatchSwitch />
      <SeqDeduction />
      <Currencies />
      <Amount />
      <HiddenFormItem name="payTag" />
      <HiddenFormItem name="recTag" />
      <Tips />
      <ConfirmButton />
    </>
  );
}
