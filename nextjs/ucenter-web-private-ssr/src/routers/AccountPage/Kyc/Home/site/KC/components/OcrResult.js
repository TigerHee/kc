/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box, Button, Form, Input, Spin, styled } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { pullOcrResult } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import Back from '../../../../components/Back';
import replaceWithBackUrl from '../../../../utils/replaceWithBackUrl';
import { Wrapper } from './styled';

const { useForm, FormItem } = Form;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 140%; /* 33.6px */
`;

const sleep = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));
const withRetry = (func, retryTime = 1, delay = 0) => {
  return async (params) => {
    while (true) {
      try {
        const res = await func(params);
        return res;
      } catch (err) {
        if (retryTime > 0) {
          retryTime--;
          if (delay > 0) {
            await sleep(delay);
          }
        } else {
          throw err;
        }
      }
    }
  };
};

const OcrResult = ({ query }) => {
  const [form] = useForm();
  const { channel, ekycflowId } = useSelector((state) => state.kyc?.ocr ?? {});
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const handleBack = () => {
    replaceWithBackUrl('/account/kyc/setup/ocr', query.backUrl);
  };

  const handleContinue = () => {
    dispatch({
      type: 'kyc/update',
      payload: {
        ocr: { query: false, channel: null, ekycflowId: null },
      },
    });
  };

  useEffect(() => {
    (async () => {
      if (channel && ekycflowId) {
        const pullResult = withRetry(
          async () => {
            const { data = {} } = await pullOcrResult({ channel, ekycflowId });
            if (!data.channelSuccess) {
              throw new Error('result is empty!');
            }
            return data;
          },
          1,
          1000,
        );
        try {
          const { idNumber, firstName, lastName } = await pullResult();
          if (idNumber && firstName && lastName) {
            form.setFieldsValue({ idNumber, firstName, lastName });
            setLoading(false);
            kcsensorsManualExpose(['personInfoConfirm', '1']);
          } else {
            handleContinue();
          }
        } catch (err) {
          console.error(err);
          handleContinue();
        }
      } else {
        handleContinue();
      }
    })();
  }, [channel, ekycflowId]);

  return (
    <Wrapper hasBack>
      <Back onBack={handleBack} />
      {loading ? (
        <div>
          <Title>{_t('bdYpNXawoXxurm8iXCeFGE')}</Title>
          <Box size={80} />
          <Spin spinning size="small" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <div>
          <Title>{_t('bdYpNXawoXxurm8iXCeFGE')}</Title>
          <Box size={24} />
          <Form form={form}>
            <FormItem name="firstName" label={_t('hmBLjz27TyabEaSSAgRttF')}>
              <Input size="xlarge" />
            </FormItem>
            <Box size={8} />
            <FormItem name="lastName" label={_t('28GFoDUetpjsfL9KDQ4pFs')}>
              <Input size="xlarge" />
            </FormItem>
            <Box size={8} />
            <FormItem name="idNumber" label={_t('vUL5xxCuLejygiJbjzabJT')}>
              <Input size="xlarge" />
            </FormItem>
          </Form>
          <Box size={20} />
          <Button
            fullWidth
            size="large"
            onClick={() => {
              trackClick(['personInfoConfirm', 'continueButton']);
              handleContinue();
            }}
          >
            {_t('83fd14a4e1604000a696')}
          </Button>
        </div>
      )}
    </Wrapper>
  );
};

export default withRouter()(OcrResult);
