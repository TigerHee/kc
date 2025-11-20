/**
 * Owner: roger@kupotech.com
 */
import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { styled } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { getSymbolText } from '@packages/trade/lib/futures';
import CoinIcon from '../CoinIcon';
import { useLang } from '../../hookTool';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
const Wrapper = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
`;
const Content = styled.span`
  width: 100%;
  font-size: 15px;
  font-weight: 500;
  line-height: 140%;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  .symbol-name {
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .symbol-tag {
    box-sizing: border-box;
    height: 14px;
    margin-left: 3px;
    padding: 0 3px;
    color: ${({ theme }) => theme.colors.text60};
    background: ${({ theme }) => theme.colors.cover4};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    [dir='rtl'] & {
      margin-right: 3px;
    }
    span {
      font-weight: 400;
      font-size: 12px;
      transform: scale(0.833);
      transform-origin: center center;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
    }
  }
`;

const symbolToText = (contract, symbol, t, icon, isTag) => {
  if (!contract) {
    return symbol;
  }
  const { symbolName, base, tagName } = getSymbolText(contract, isTag);

  return (
    <>
      {icon && <CoinIcon icon={icon} coin={base} />}
      <Content>
        <div className="symbol-name">{symbolName}</div>
        {tagName && (
          <div className="symbol-tag">
            <span>{tagName}</span>
          </div>
        )}
      </Content>
    </>
  );
};

const SymbolText = ({ contract, symbol, icon, isTag }) => {
  const { t } = useLang();
  const text = symbolToText(contract, symbol, t, icon, isTag);
  return <Wrapper>{text}</Wrapper>;
};

export default SymbolText;
