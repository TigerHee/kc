/**
 * Owner: jesse@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button, styled } from '@kux/mui';

import Link from '../components/Link';
import { useLang } from '../hookTool';
import SignupBox from '../../static/newHeader/signup_box.svg';

const Wrap = styled(Link)`
  display: ${(props) => (props.showElement ? 'flex' : 'none')};
  margin-right: 0px;

  & .signUpBtnSm {
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 500;
  }

  & .signUpBtnImg {
    width: 12px;
    height: 12px;
    margin: 0 4px 0 0;
  }
`;

export default ({ signHref, handleSinup }) => {
  const [showElement, setShowElement] = useState(false);
  const { t } = useLang();
  const _onScroll = useCallback(() => {
    const scrollTop =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
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
    <Wrap
      showElement={showElement}
      href={signHref}
      onClick={handleSinup}
      className="MobileSignUpBtn"
    >
      <Button className="signUpBtnSm" size="small" data-modid="register">
        <img className="signUpBtnImg" src={SignupBox} alt="" />
        {t('sign.up')}
      </Button>
    </Wrap>
  );
};
