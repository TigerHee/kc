/*
 * owner: borden@kupotech.com
 */
import { ICArrowUpOutlined } from '@kux/icons';
import { Form, InputNumber, styled, useResponsive, useSnackbar } from '@kux/mui';
import { useLockFn } from 'ahooks';
import CoinSelector from 'components/CoinSelector';
import { Decimal, evtEmitter } from 'helper';
import useRequest from 'hooks/useRequest';
import { useSelector } from 'hooks/useSelector';
import { isNil, map, reduce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SENSORS } from 'routes/SlothubPage/constant';
import { exchangePoints } from 'services/slothub';
import { _t, _tHTML } from 'tools/i18n';
import FastButtonGroup from '../components/FastButtonGroup';
import Dialog from '../components/mui/Dialog';
import NumberFormat from '../components/mui/NumberFormat';
import { multiply } from '../utils';
import ResultDialog from './ResultDialog';

const event = evtEmitter.getEvt();
const { useForm, useWatch, FormItem } = Form;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Label = styled.span`
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 14px;
  }
`;
const Value = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 14px;
  }
`;
const Alert = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-top: 24px;
  counter-reset: chapter;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 32px;
    padding: 24px;
  }
`;
const AlertTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;
const AlertContent = styled.div`
  font-size: 13px;
  line-height: 130%;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text40};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: 12px;
    font-size: 14px;
  }
  &::before {
    content: counter(chapter) '. ';
    counter-increment: chapter;
  }
  .highlight {
    color: #f8b200;
  }
`;

const ConvertDialog = ({ ...restProps }) => {
  const [form] = useForm();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const currency = useWatch('currency', form);
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const convertDialogConfig = useSelector((state) => state.slothub.convertDialogConfig);

  const latestValues = useRef({});
  const [resultOpen, setResultOpen] = useState(false);

  const {
    effectiveDays,
    remainingPoints,
    redemptionLimit,
    availableProjects,
    requiredCurrencyTaskProjects,
  } = userSummary || {};
  const { open = false, onCancel } = convertDialogConfig;

  const availableProjectsMap = useMemo(() => {
    return reduce(
      availableProjects,
      (a, b) => {
        a[b.currency] = b;
        return a;
      },
      {},
    );
  }, [availableProjects]);

  const { maxExchangePoints, currencyName: currentCurrencyName } =
    availableProjectsMap[currency] || {};
  const { currencyName } = availableProjectsMap[latestValues.current.currency] || {};
  const isNilMaxExchangePoints = isNil(maxExchangePoints);

  const requiredCurrencyTaskProjectsStr = useMemo(() => {
    return map(requiredCurrencyTaskProjects, (v) => v.currencyName).join('、');
  }, [requiredCurrencyTaskProjects]);

  const currencyRules = useMemo(() => {
    return [
      {
        required: true,
        message: _t('e36d3ec439a74000afbf'),
      },
      {
        validator: (_, value) => {
          const { listStatus } = availableProjectsMap[value] || {};
          if (listStatus === 1) {
            return Promise.reject(_t('06094623c3d94000a0e1'));
          }
          if (listStatus === 2) {
            return Promise.reject(_t('93ab863d0e9c4000adc8', { token: currentCurrencyName }));
          }
          return Promise.resolve();
        },
      },
    ];
  }, [availableProjectsMap, currentCurrencyName]);

  const scoresRules = useMemo(() => {
    return [
      {
        validateTrigger: 'onSubmit',
        validator: (_, value) => {
          if (isNil(value)) {
            return Promise.reject(_t('trans.amount.num.err'));
          }
          return Promise.resolve();
        },
      },
      {
        validator: (_, value) => {
          if (isNil(value)) {
            return Promise.resolve();
          }
          if (value % 1 !== 0) {
            return Promise.reject(_t('c65b1589a1624000a33d'));
          }
          if (value < 1) {
            return Promise.reject(_t('0d83946934264000af22'));
          }
          if (isFinite(maxExchangePoints) && value > maxExchangePoints) {
            return Promise.reject(_t('2ae8b246af3d4000a91c', { a: maxExchangePoints }));
          }
          return Promise.resolve();
        },
      },
    ];
  }, [maxExchangePoints]);

  const { loading: confirmLoading, runAsync } = useRequest(exchangePoints, {
    manual: true,
    onError: (error, errorHandler) => {
      if ([514008, 514014, 514015].includes(+error?.code)) {
        message.info(_t('644cfa8ff95d4000a645'));
      } else {
        errorHandler();
      }
    },
  });

  const exchangePointFetch = useLockFn(runAsync);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ currency: convertDialogConfig.currency });
      if (convertDialogConfig.currency) {
        // 当前执行栈完成之后再执行校验，以确保错误信息能及时并正确地展示
        setTimeout(() => {
          form.validateFields(['currency']);
        });
      }
      dispatch({ type: 'slothub/pullUserSummary' });
    }
  }, [convertDialogConfig]);

  const handleFaskClick = useCallback(
    (v) => {
      if (isNilMaxExchangePoints) {
        return message.info(_t('e36d3ec439a74000afbf'));
      }
      let ret;
      switch (v) {
        case 'min':
          ret = maxExchangePoints === 0 ? 0 : 1;
          break;
        case 1:
          ret = maxExchangePoints;
          break;
        default:
          ret = multiply(maxExchangePoints)(v).toFixed(0, Decimal.ROUND_UP);
      }
      form.setFieldsValue({ scores: ret });
    },
    [form, isNilMaxExchangePoints, maxExchangePoints, message],
  );

  const handleCancel = useCallback(
    (...rest) => {
      form.resetFields();
      dispatch({
        type: 'slothub/update',
        payload: {
          convertDialogConfig: {},
        },
      });
      if (onCancel) onCancel(...rest);
    },
    [onCancel],
  );

  const handleOk = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        exchangePointFetch(values).then(() => {
          latestValues.current = values;
          dispatch({ type: 'slothub/pullUserSummary' });
          event.emit('__GEMSLOT_CONVERT_SUCCESS__');
          form.resetFields();
          dispatch({
            type: 'slothub/updateConvertDialogConfig',
            payload: { open: false },
          });
          setResultOpen(true);
        });
        SENSORS.exchange({ currency: values.currency });
      })
      .catch(() => {
        // asd
      });
  }, []);

  const handleResultDialogOk = useCallback(() => {
    setResultOpen(false);
    handleCancel(true);
  }, [handleCancel]);

  return (
    <>
      <Dialog
        open={open}
        size="large"
        destroyOnClose
        onOk={handleOk}
        onCancel={handleCancel}
        headerProps={{ border: false }}
        title={_t('664e8047fd874000aa9b')}
        okText={_t('e6b28557f5444000af78')}
        cancelText={sm ? _t('cancel') : null}
        cancelButtonProps={{ variant: 'text' }}
        okButtonProps={{ loading: confirmLoading }}
        {...restProps}
      >
        <Form form={form} style={{ paddingTop: 6 }}>
          <FormItem name="currency" label={_t('517cb2a985df4000a9d2')} rules={currencyRules}>
            <CoinSelector
              showIcon
              currencies={availableProjects}
              size={sm ? 'xlarge' : 'large'}
              dropdownIcon={<ICArrowUpOutlined />}
            />
          </FormItem>
          <FormItem name="scores" keepHelpMounted={false} rules={scoresRules}>
            <InputNumber
              controls={false}
              size={sm ? 'xlarge' : 'large'}
              placeholder={
                isNilMaxExchangePoints
                  ? _t('5e132c1c9f404000aea8')
                  : maxExchangePoints > 0
                  ? _t('376dae74b9a64000a2b9', { a: maxExchangePoints })
                  : _t('a6e0dbb1b50f4000ad7a')
              }
            />
          </FormItem>
          <FastButtonGroup
            showMinButton
            className="mt-12"
            onChange={handleFaskClick}
            size={sm ? 'large' : 'basic'}
          />
          <Row className={sm ? 'mt-24' : 'mt-16'}>
            <Label>{_t('f09b4674d97b4000aede')}</Label>
            <Value>
              {' '}
              {maxExchangePoints ? <NumberFormat>{maxExchangePoints}</NumberFormat> : '0'}
            </Value>
          </Row>
          <Row className="mt-8">
            <Label>{_t('adcabf3c02c54000a302')}</Label>
            <Value>
              <NumberFormat>{remainingPoints || 0}</NumberFormat>
            </Value>
          </Row>
          <Alert>
            <AlertTitle>{_t('4928688facdf4000a028')}</AlertTitle>
            <AlertContent style={{ marginTop: sm ? 16 : 10 }}>
              {_t('b8d9937ffe2a4000ab02')}
            </AlertContent>
            {Boolean(redemptionLimit) && (
              <AlertContent>{_t('3712ba25d3394000a36b', { a: redemptionLimit })}</AlertContent>
            )}
            {Boolean(requiredCurrencyTaskProjectsStr) && (
              <AlertContent>
                {_tHTML('9a72c4601a974000a330', { coin: requiredCurrencyTaskProjectsStr })}
              </AlertContent>
            )}
            {Boolean(effectiveDays) && (
              <AlertContent>
                {_t('ccc47d6eae6b4000a51b', { a: `${effectiveDays} * 24` })}
              </AlertContent>
            )}
          </Alert>
        </Form>
      </Dialog>
      <ResultDialog
        open={resultOpen}
        onOk={handleResultDialogOk}
        title={_t('609ede2814f94000a7cf')}
        descripe={_tHTML('e54b27d30e354000ae71', {
          token: currencyName,
          a: latestValues.current.scores,
        })}
      />
    </>
  );
};

export default React.memo(ConvertDialog);
