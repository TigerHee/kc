/**
 * Owner: odan.ou@kupotech.com
 */

import styled from '@emotion/styled';
import React, { memo } from 'react';
import official_document from 'static/legal/official-document.svg';
import { addLangToPath } from 'tools/i18n';
import { eFalseStyle, eScreenStyle, eTheme, LegalConf, _t, _tHTML } from './utils';

const requestGuidelinesUrl = addLangToPath('/legal/law-enforcement-request-guidelines');

const LegalHeaderWrapper = styled.div`
  padding: 50px 0 50px ${LegalConf.LeftPadding};
  background: ${eTheme('text')};
  color: #f3f3f3;
  position: relative;
  overflow: hidden;
  ${eScreenStyle('Max1200')`
    padding-left: 24px;
    padding-right: 24px;
    .legalHeader {
      font-size: 36px;
    }
    .legalSubHeader {
      font-size: 15px;
    }
  `}
  ${eScreenStyle('Max768')`
    padding-left: 16px;
    padding-right: 16px;
    .legalHeader {
      font-size: 24px;
    }
    .legalSubHeader {
      font-size: 15px;
    }
  `}
`;

const HeaderTextContent = styled.div`
  ${eFalseStyle('littleScreen')`
    width: 720px;
  `}
  > .legalHeader {
    margin-bottom: 0;
    color: #f3f3f3;
    font-weight: 700;
    font-size: 48px;
    line-height: 130%;
    word-break: break-all;
  }
  > .legalSubHeader {
    margin-top: 16px;
    color: rgba(243, 243, 243, 0.4);
    font-weight: 400;
    font-size: 16px;
    line-height: 130%;
    text-align: justify;
  }
`;

const HeaderBgWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: calc(50% + 20px);
  top: 0;
  right: 0;
`;
const HeaderBgContent = styled.div`
  background: linear-gradient(-40deg, #fff 100%, #fff 0);
  clip-path: polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%);
  height: 100%;
  opacity: 0.04;
`;

const HeaderBgImg = styled.img`
  top: 10px;
  left: 360px;
  position: absolute;
`;

const HeaderBottom = styled.div`
  height: 64px;
  background: ${eTheme('text')};
  > div {
    height: 100%;
    background: ${eTheme('backgroundMajor')};
    border-radius: 40px 40px 0 0;
    ${eScreenStyle('Max768')`
      border-radius: 24px 24px 0 0;
    `}
  }
  ${eScreenStyle('Max1200')`
    height: 40px;
  `}
  ${eScreenStyle('Max768')`
    height: 24px;
  `}
`;

const LegalHeader = (props) => {
  const { screen, littleScreen } = props;
  return (
    <React.Fragment>
      <LegalHeaderWrapper screen={screen}>
        <HeaderTextContent littleScreen={littleScreen}>
          <h1 className="legalHeader">{_t('x9Uuq2GjkGGbxqyh4YfCPa', '执法请求')}</h1>
          <div className="legalSubHeader">
            {_tHTML(
              '1Toq3poHxAGSZJNWBk7pWe',
              <>
                请参照
                <a target="_blank" rel="noopener noreferrer" href={requestGuidelinesUrl}>
                  《执法请求指南》
                </a>
                中的步骤提交您的请求，提交错误或不准确的信息可能会导致您的请求无法及时处理。
              </>,
              { href: requestGuidelinesUrl },
            )}
          </div>
        </HeaderTextContent>

        <HeaderBgWrapper>
          <HeaderBgContent />
          <HeaderBgImg alt="" src={official_document} />
        </HeaderBgWrapper>
      </LegalHeaderWrapper>
      <HeaderBottom screen={screen}>
        <div />
      </HeaderBottom>
    </React.Fragment>
  );
};

export default memo(LegalHeader);
