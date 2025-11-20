import { Alert, Button, Steps, toast } from '@kux/design';
import classNames from 'classnames';
import { Email } from 'components/Account/Security/Email';
import { G2FA } from 'components/Account/Security/G2FA';
import { Phone } from 'components/Account/Security/Phone';
import { TradePassword } from 'components/Account/Security/TradePassword';
import { cryptoPwd } from 'helper';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  postResetG2FA,
  postSendCode,
  postValidateG2FA,
  postVerifyCode,
} from 'src/services/ucenter/reset-security';
import { _t } from 'src/tools/i18n';
import { RESET_ITEMS, RESET_ITEM_INFOS, RESET_ITEM_ORDERS } from '../../constants';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const crypto = (str) => {
  return cryptoPwd(str);
};

const BIZ_TYPE_EMAIL = 'RESET_EMAIL';
const BIZ_TYPE_PHONE = 'RESET_PHONE';

export default function ResetItems({ token, items, email, phone, onNext }) {
  const cacheRef = useRef({});
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const onlyOne = items.length === 1;
  const sortedItems = useMemo(
    () => items.sort((a, b) => RESET_ITEM_ORDERS[a] - RESET_ITEM_ORDERS[b]),
    [items],
  );
  const [current, setCurrent] = useState(sortedItems[0]);
  const [g2faKey, setG2faKey] = useState('');

  const handleNext = (res) => {
    cacheRef.current = { ...cacheRef.current, ...res };
    if (sortedItems.indexOf(current) + 1 === sortedItems.length) {
      onNext(cacheRef.current);
    } else {
      setCurrent(sortedItems[sortedItems.indexOf(current) + 1]);
    }
  };

  const handleResetEmail = async ({ email, code }) => {
    try {
      await postVerifyCode({
        bizType: BIZ_TYPE_EMAIL,
        token,
        address: email,
        ['validations[email]']: code,
      });
      handleNext({ rebindEmail: email });
    } catch (error) {
      toast.error(error?.msg || error?.message);
    }
  };

  const handleResetPhone = async ({ phone, countryCode, sendChannel, code }) => {
    try {
      await postVerifyCode({
        bizType: BIZ_TYPE_PHONE,
        token,
        sendChannel,
        address: `${countryCode}-${phone}`,
        ['validations[sms]']: code,
      });
      handleNext({ rebindPhone: `${countryCode}-${phone}` });
    } catch (error) {
      toast.error(error?.msg || error?.message);
    }
  };

  const handleResetG2fa = async ({ code }) => {
    try {
      await postValidateG2FA({ token, code });
      handleNext();
    } catch (error) {
      toast.error(error?.msg || error?.message);
    }
  };

  const handleResetTradePassword = ({ password }) => {
    handleNext({ rebindTradePassword: crypto(password) });
  };

  useEffect(() => {
    if (sortedItems.indexOf(RESET_ITEMS.G2FA) > -1) {
      // 步骤是绑定 G2FA 时，需要获取 key
      postResetG2FA({ token }).then((res) => {
        setG2faKey(res?.data || '');
      });
    }
  }, [sortedItems]);

  const title = useMemo(() => {
    return onlyOne ? RESET_ITEM_INFOS[current].title() : _t('01ec7d2744564000abad');
  }, [onlyOne, current]);

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.header}>{title}</div>
      {!onlyOne ? (
        <div className={styles.stepWrapper}>
          <Steps current={sortedItems.indexOf(current)} direction="horizontal">
            {sortedItems.map((key) => {
              const { title } = RESET_ITEM_INFOS[key];
              return <Steps.Step key={key} title={key !== current && isH5 ? null : title()} />;
            })}
          </Steps>
        </div>
      ) : null}
      <div>
        <div className={classNames(styles.alertWrapper, { [styles.multipleSteps]: !onlyOne })}>
          <Alert
            type="warning"
            duration={0}
            message={
              current === RESET_ITEMS.EMAIL ? (
                _t('dd1ed385401d4000a53b')
              ) : current === RESET_ITEMS.PHONE ? (
                _t('4d73a1ebb0c74000a983')
              ) : current === RESET_ITEMS.G2FA ? (
                _t('bcbcca0989c84000adda')
              ) : current === RESET_ITEMS.TRADE_PASSWORD ? (
                <div>
                  <div>{_t('499a3770275e4800a9f0')}</div>
                  <div>{_t('2f27128983884000af0e')}</div>
                </div>
              ) : null
            }
          />
        </div>
        {current === RESET_ITEMS.EMAIL ? (
          <Email
            addressLabel={_t('ngt8X2qZ79RJAJjVAAaQHi')}
            hiddenAlert
            customSendRequest={async ({ email }) => {
              try {
                const res = await postSendCode({
                  bizType: BIZ_TYPE_EMAIL,
                  token,
                  address: email,
                  sendChannel: 'EMAIL',
                });
                return res.data;
              } catch (error) {
                toast.error(error?.msg || error?.message);
              }
            }}
            onSubmit={handleResetEmail}
          />
        ) : current === RESET_ITEMS.PHONE ? (
          <>
            <Phone
              addressLabel={_t('my_phone_titel')}
              hiddenAlert
              customSendRequest={async ({ phone, sendChannel }) => {
                try {
                  const res = await postSendCode({
                    bizType: BIZ_TYPE_PHONE,
                    token,
                    address: phone,
                    sendChannel,
                  });
                  return res.data;
                } catch (error) {
                  toast.error(error?.msg || error?.message);
                }
              }}
              onSubmit={handleResetPhone}
            />
            {items.length > 2 ? (
              <Button
                type="text"
                fullWidth
                onClick={() => handleNext({})}
                style={{ marginTop: 12 }}
              >
                {_t('b1fd168c0dc14000aa14')}
              </Button>
            ) : null}
          </>
        ) : current === RESET_ITEMS.G2FA ? (
          g2faKey ? (
            <G2FA
              hiddenAlert
              email={email}
              phone={phone}
              g2faKey={g2faKey}
              onSubmit={handleResetG2fa}
            />
          ) : null
        ) : current === RESET_ITEMS.TRADE_PASSWORD ? (
          <TradePassword hiddenAlert onSubmit={handleResetTradePassword} />
        ) : null}
      </div>
    </div>
  );
}
