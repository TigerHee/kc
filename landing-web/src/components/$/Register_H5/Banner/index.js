/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useState, Fragment } from 'react';

import { Input, Button } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import { _t, _tHTML } from 'utils/lang';
import { useDispatch, useSelector } from 'dva';
import { REGEXP } from 'components/DrawerSignUp/const';
import bannerSvg from 'assets/registration/banner_image.svg';
import styles from './style.less';
import { kcsensorsClick, kcsensorsManualExpose} from 'utils/ga';

const Banner = () => {
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { currentLang } = useSelector(state => state.app);
  const [inputValue, setInputValue] = useState(null);

  const handleChange = useCallback(e => {
    setInputValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    // ReactGA.ga('send', 'event', 'ld', 'click', 'register');
    kcsensorsClick(['confirmButton', '1']);
    const checkValue = (inputValue || '').trim();
    if (!checkValue) {
      message.warning(_t('form.format.error'));
      return;
    }
    if (REGEXP.phone.test(checkValue) || REGEXP.email.test(checkValue)) {
      const isEmail = !REGEXP.phone.test(checkValue);
      if (isEmail) {
        dispatch({
          type: 'register/update',
          payload: {
            drawerSignUpTabKey: 'sign.email.tab',
            drawerSignUpInitEmail: checkValue,
            drawerSignUpOpen: true,
          },
        });
      } else {
        dispatch({
          type: 'register/update',
          payload: {
            drawerSignUpTabKey: 'sign.phone.tab',
            drawerSignUpInitPhone: checkValue,
            drawerSignUpOpen: true,
          },
        });
      }
      kcsensorsManualExpose(
        { kc_pageid: 'B1landRegister' },
        ['popUp', '1']
      );
    } else {
      message.warning(_t('register.format.error'));
    }
  }, [inputValue]);

  return (
    <Fragment>
      <div className={styles.banner}>
        <div className={styles.title}>{_t('register.banner.new.title')}</div>
        <div className={styles.sub}>{_t('register.banner.sub')}</div>
        <img src={bannerSvg} alt="" />

        <div className={styles.signBox}>
          <div className={styles.leftSign}>
            <Input
              value={inputValue}
              placeholder={_t('register.banner.email')}
              classNames={{
                container: styles.signInput
              }}
              onChange={handleChange}
            />

            <Button type="primary" className={styles.signBtn} onClick={handleSubmit}>
              {_t('register.signup')}
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Banner;
