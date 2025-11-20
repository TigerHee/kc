/**
 * Owner: ella.wang@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button } from '@kux/mui';
import storage from 'src/utils/storage';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { Wrapper, TopInfo, Image, Information, Description } from './index.style';
import Welfare from 'static/mining-pool/welfare.svg';

export default ({ signupBlockid }) => {
  const [value, setValue] = useState();

  useEffect(() => {
    storage.removeItem('signup.account');
  }, []);

  const handleSignUp = useCallback(() => {
    let url = '/ucenter/signup';
    if (value) {
      if (/@/.test(value)) {
        storage.setItem('signup.account', {
          type: 'email',
          value,
        });
        url = '/ucenter/signup?type=mail';
      } else {
        storage.setItem('signup.account', {
          type: 'phone',
          value,
        });
        url = '/ucenter/signup?type=phone';
      }
    }
    if (signupBlockid) {
      trackClick([signupBlockid, '1']);
    }
    window.location.href = addLangToPath(url);
  }, [value, signupBlockid]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  return (
    <Wrapper>
      <TopInfo>
        <Image src={Welfare} />
        <Information>{_tHTML('q4FUiCm1cs2CSZxbLKmqCD')}</Information>
      </TopInfo>
      <Description>{_t('ghpuqWpJWow7RkSFc6LFNN')}</Description>
      <Input placeholder={_t('nT2xj43ctSeL4kNa3RzXtJ')} size="large" onChange={handleChange} />
      <Button size="large" onClick={handleSignUp}>
        {_t('newcomer.btnEntry.signUp')}
      </Button>
    </Wrapper>
  );
};
