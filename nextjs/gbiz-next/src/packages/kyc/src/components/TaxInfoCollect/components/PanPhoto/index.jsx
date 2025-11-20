/**
 * Owner: tiger@kupotech.com
 */
import { Form, Button, useSnackbar, styled } from '@kux/mui';
import clsx from 'clsx';
import { useState } from 'react';
import { debounce, isEmpty } from 'lodash-es';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { kcsensorsClick } from 'packages/kyc/src/common/tools';
import { Main, Title, Desc, Footer } from '../style';
import UploadPhoto from './UploadPhoto';
import { submitPan } from '../../service';
import exampleImg1 from './img/example1.svg';
import exampleImg2 from './img/example2.svg';
import exampleImg3 from './img/example3.svg';
import exampleImg4 from './img/example4.svg';

const SubTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 24px;
  margin-bottom: 8px;
  color: var(--color-text);
`;
const ExampleBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
`;
const ExampleItem = styled.div`
  width: 22.9%;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.isH5Style {
    width: 23.25%;
  }
  img {
    width: 100%;
    margin-bottom: 8px;
  }
  span {
    font-size: 13px;
    font-weight: 400;
    line-height: 130%;
    text-align: center;
    color: var(--color-text60);
    &.isH5Style {
      font-size: 10px;
    }
  }
`;
const UploadBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.isH5Style {
    flex-direction: column;
  }
  .KuxForm-itemHelp {
    display: none;
  }
`;
const UploadItem = styled.div`
  flex: 1;
  &:first-child {
    margin-right: 24px;
    &.isH5Style {
      margin-right: 0;
    }
  }
  &.isH5Style {
    width: 100%;
  }
`;

const { FormItem, useForm } = Form;
const exampleData = [
  {
    title: '8b421d2478354000abb3',
    icon: exampleImg1,
  },
  {
    title: 'be9c5926bc2c4000aea5',
    icon: exampleImg2,
  },
  {
    title: '92261b0c09464000a23f',
    icon: exampleImg3,
  },
  {
    title: '5a5cfe5572934000a7a5',
    icon: exampleImg4,
  },
];

export default ({
  isH5Style,
  isInDialog,
  onViewToPanResult,
  formData,
  source,
  setPanStatusData,
}) => {
  const [form] = useForm();
  const { _t } = useLang();
  const { message } = useSnackbar();
  const [allV, setAllV] = useState({});
  const [loading, setLoading] = useState(false);

  // 提交
  const onSubmit = debounce(() => {
    kcsensorsClick(['KYCPanSubmit', '1'], { source });
    form
      .validateFields()
      .then((values) => {
        setLoading(true);
        submitPan({ ...formData, ...values })
          .then((res) => {
            if (res?.success) {
              message.success(_t('mT4Zbo4wYKCmMoG6NAsBz2'));
              setPanStatusData({});
              onViewToPanResult();
            }
          })
          .catch((err) => {
            const msg = err?.msg || err?.message;
            msg && message.error(msg);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((err) => {
        console.info('err === ', err);
      });
  }, 300);

  return (
    <>
      <Main
        className={clsx({
          isH5Style,
        })}
      >
        <Title>{_t('a55a2ecc4bee4000ad2c')}</Title>
        <Desc>{_t('350d0e190cda4000a251')}</Desc>
        <SubTitle>{_t('a082f8908e754000acc3')}</SubTitle>
        <ExampleBox>
          {exampleData.map(({ title, icon }) => {
            return (
              <ExampleItem
                key={title}
                className={clsx({
                  isH5Style,
                })}
              >
                <img src={icon} alt={title} />
                <span
                  className={clsx({
                    isH5Style,
                  })}
                >
                  {_t(title)}
                </span>
              </ExampleItem>
            );
          })}
        </ExampleBox>

        <Form
          form={form}
          onValuesChange={(v, allV) => {
            setAllV(allV);
          }}
        >
          <UploadBox
            className={clsx({
              isH5Style,
            })}
          >
            <UploadItem
              className={clsx({
                isH5Style,
              })}
            >
              <SubTitle>{_t('3acd52c202c64000a2b5')}</SubTitle>
              <FormItem name="panCardFront">
                <UploadPhoto />
              </FormItem>
            </UploadItem>

            <UploadItem
              className={clsx({
                isH5Style,
              })}
            >
              <SubTitle>{_t('c40cb61270da4000a292')}</SubTitle>
              <FormItem name="panCardBack">
                <UploadPhoto />
              </FormItem>
            </UploadItem>
          </UploadBox>
        </Form>
      </Main>
      <Footer
        className={clsx({
          isH5Style,
          isShowBorderTop: isInDialog,
        })}
      >
        <Button
          disabled={isEmpty(allV) || Object.values(allV).some((i) => !i)}
          size={isH5Style ? 'large' : 'basic'}
          fullWidth={isH5Style}
          onClick={onSubmit}
          loading={loading}
        >
          <span>{_t('044d6ded75a34000ab3b')}</span>
        </Button>
      </Footer>
    </>
  );
};
