/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import headerbn_BD from '@kc/header/lib/locale/pl_PL';
import { Header, LocaleProvider } from '@kc/header/lib/componentsBundle';
import { hostConfig } from '../hostConfig';

const isLogin = true;

const userInfo = {
  'honorLevel': 0,
  'language': 'fil_PH',
  'csrf': 'cab60f7bc56043208dfb92845efa1071',
  'type': 1,
  'emailValidate': true,
  'subAccount': 'jcm',
  'uid': 30722457,
  'createdAt': 1571127274000,
  'countryCode': null,
  'referralCode': '238b2Rd',
  'nickname': 'lodash',
  'currency': 'USD',
  'id': null,
  'subLevel': 1,
  'email': '14**@**.com',
  'tradeType': 7,
  'timeZone': 'singapore',
  'avatar': 'https://assets.kcsfile.com/ucenter/header/1.png',
  'domainId': null,
  'parentId': null,
  'lastLoginAt': 1640589311000,
  'phone': null,
  'needDepositValidate': false,
  'subType': 0,
  'balanceCurrency': 'BTC',
  'phoneValidate': false,
  'status': 2,
};
// const surportLanguages = ['en_US', 'ru_RU', 'ja_JP']; // 测试新配置项，可不传
const user = isLogin ? userInfo : undefined;
const Headers = () => {
  return (
    <div style={{ height: 1600, background: '#F7F8FA' }}>
      <LocaleProvider locale={headerbn_BD}>
        <Header
          currentLang="fil_PH"
          theme="light"
          currency="USD"
          {...hostConfig}
          userInfo={user}
          // surportLanguages={surportLanguages}
        />
      </LocaleProvider>
    </div>
  );
};

export default Headers;
