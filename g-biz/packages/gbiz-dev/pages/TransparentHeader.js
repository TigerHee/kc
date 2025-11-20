/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import en_US from '@kc/header/lib/locale/ko_KR';
import { Header, LocaleProvider } from '@kc/header/lib/componentsBundle';
import { hostConfig } from '../hostConfig';

const userInfo = {
  'honorLevel': 0,
  'language': 'en_US',
  'csrf': 'cab60f7bc56043208dfb92845efa1071',
  'type': 1,
  'emailValidate': true,
  'subAccount': null,
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

const isDark = true;

const TransparentHeader = () => {
  return (
    <div style={{ background: isDark ? '#01081e' : '#fff' }}>
      <LocaleProvider locale={en_US}>
        <Header
          currentLang="en_US"
          theme={isDark ? 'dark' : 'light'}
          currency="EUR"
          transparent
          {...hostConfig}
          userInfo={userInfo}
        />
      </LocaleProvider>

      <div style={{ background: '#fff', width: '100%' }}>
        <p style={{ height: 200, marginBottom: 20, width: '100%', background: 'purple' }}>1</p>
        <p style={{ height: 200, marginBottom: 20, width: '100%', background: 'purple' }}>1</p>
        <p style={{ height: 200, marginBottom: 20, width: '100%', background: '#01081e' }}>1</p>
        <p style={{ height: 200, marginBottom: 20, width: 300 }}>1</p>
        <p style={{ height: 200, marginBottom: 20, width: 300 }}>1</p>
        <p style={{ height: 200, marginBottom: 20, width: 300 }}>0</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>2</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>3</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>4</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>5</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>6</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
        <p style={{ height: 200, margin: 20, width: 300 }}>1</p>
      </div>
    </div>
  );
};

export default TransparentHeader;
