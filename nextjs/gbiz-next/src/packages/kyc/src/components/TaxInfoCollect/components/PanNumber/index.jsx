/**
 * Owner: tiger@kupotech.com
 */
import { Form, Input, Button } from '@kux/mui';
import clsx from 'clsx';
import { useState } from 'react';
import { debounce } from 'lodash-es';
import JsBridge from 'tools/jsBridge';
import addLangToPath from 'tools/addLangToPath';
import { Trans } from 'tools/i18n';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { kcsensorsClick } from 'packages/kyc/src/common/tools';
import { getSiteConfig } from 'kc-next/boot';
import { Main, Title, Desc, Footer } from '../style';

const { FormItem, useForm } = Form;
const validateErr1 = value => !value || !/^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(value);
const validateErr2 = value => value?.length !== 10;

export default ({ isH5Style, inApp, isInDialog, source, setFormData, onViewToPanPhoto }) => {
  const [form] = useForm();
  const { _t } = useLang();
  const [allV, setAllV] = useState({});

  const siteConfig = getSiteConfig();
  const { KUCOIN_HOST } = siteConfig;

  // 提交
  const onSubmit = debounce(() => {
    form
      .validateFields()
      .then(values => {
        setFormData({ ...values });
        onViewToPanPhoto();
      })
      .catch(err => {
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
        <Title>{_t('qGZE5XsRSnUA65GLXKdDoq')}</Title>
        <Desc
          onClick={e => {
            if (e?.target?.nodeName?.toLocaleUpperCase() === 'SPAN') {
              const hrefPath = '/support/30538829815833?appNeedLang=true';

              if (inApp) {
                if (KUCOIN_HOST) {
                  JsBridge.open({
                    type: 'jump',
                    params: {
                      url: `/link?url=${KUCOIN_HOST}${hrefPath}`,
                    },
                  });
                } else {
                  window.location.href = addLangToPath(hrefPath);
                }
              } else {
                window.open(addLangToPath(hrefPath));
              }
            }
          }}
        >
          <Trans i18nKey="q1gG27K8FL5p3HkH8GMS6f" ns="kyc" components={{ span: <span /> }} />
        </Desc>
        <Desc>
          <Trans i18nKey="7e26KmAthZM7r5VXKhokQb" ns="kyc" components={{ span: <span /> }} />
        </Desc>
        <Form
          form={form}
          onValuesChange={(v, allV) => {
            setAllV(allV);
          }}
        >
          <FormItem
            name="panNumber"
            label={_t('n5CXQr921RCrqat4w3nv1v')}
            rules={[
              {
                validator(_, value) {
                  if (validateErr1(value)) {
                    return Promise.reject(new Error(_t('c82c7de82db54000a8e7')));
                  }
                  if (validateErr2(value)) {
                    return Promise.reject(new Error(_t('ozFKfFWSvFJsrkZb9w3kqW')));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              size="xlarge"
              fullWidth
              onFocus={() => {
                kcsensorsClick(['pan_input', '1'], { source });
              }}
              onBlur={() => {}}
              onKeyUp={e => {
                if (e && (e?.key === 'Enter' || e?.keyCode === 13)) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
            />
          </FormItem>
        </Form>
      </Main>
      <Footer
        className={clsx({
          isH5Style,
          isShowBorderTop: isInDialog,
        })}
      >
        <Button
          disabled={validateErr1(allV?.panNumber) || validateErr2(allV?.panNumber)}
          size={isH5Style ? 'large' : 'basic'}
          fullWidth={isH5Style}
          onClick={onSubmit}
        >
          {_t('044d6ded75a34000ab3b')}
        </Button>
      </Footer>
    </>
  );
};
