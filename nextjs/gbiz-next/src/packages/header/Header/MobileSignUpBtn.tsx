/**
 * Owner: jesse@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@kux/design';
import clsx from 'clsx';
import Link from '../components/Link';
import SignupBox from '../../static/newHeader/signup_box.svg';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss';

export default ({ signHref, handleSinup }) => {
  const [showElement, setShowElement] = useState(false);
  const { t } = useTranslation('header');
  const _onScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const screenHeight = window.innerHeight;
    if (scrollTop > screenHeight) {
      setShowElement(true);
    } else {
      setShowElement(false);
    }
  }, [setShowElement]);

  useEffect(() => {
    window.addEventListener('scroll', _onScroll);

    return () => {
      window.removeEventListener('scroll', _onScroll);
    };
  }, [_onScroll]);

  return (
    <Link
      className={clsx('MobileSignUpBtn', styles.mobileSignUpBtnWrap)}
      href={signHref}
      style={{ display: showElement ? 'flex' : 'none' }}
      onClick={handleSinup}
    >
      <Button className={styles.signUpBtnSm} size="small" data-modid="register">
        <img className={styles.signUpBtnImg} src={SignupBox} alt="" />
        {t('sign.up')}
      </Button>
    </Link>
  );
};
