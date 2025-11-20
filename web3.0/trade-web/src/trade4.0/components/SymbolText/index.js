/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import { useSymbolCellNeedInfo } from '@/hooks/futures/useGetSymbolText';
import { styled, fx } from '@/style/emotion';

const SymbolText = styled.div`
  ${fx.display('inline-flex')}
  ${fx.alignItems('center')}
  ${fx.flexFlow('nowrap')}
  &.can-wrap {
    ${fx.flexWrap('wrap')}
  }

  [dir='rtl'] & {
    direction: rtl;
  }
`;

const SymbolContent = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.flexFlow('nowrap')}
  margin-right: 4px;
  [dir='rtl'] & {
    margin-left: 4px;
    margin-right: unset;
  }
`;

const TypeContent = styled.div``;

const SymbolTextComponent = (props) => {
  const {
    symbol,
    symbolClassName = '',
    typeClassName = '',
    boxClassName = '',
    className = '',
    isNotWrap = true,
  } = props;
  const { symbolTextInfo } = useSymbolCellNeedInfo(symbol);
  const { base, settle } = symbolTextInfo;
  return (
    <SymbolText
      className={`${boxClassName} ${className} symbol-box ${isNotWrap ? 'no-wrap' : 'can-wrap'}`}
      dir="ltr"
    >
      <SymbolContent className={symbolClassName}>
        {!base || !settle ? (
          '--'
        ) : (
          <>
            <div className="base">{base}</div>
            <div className="settle">{`/${settle}`}</div>
          </>
        )}
      </SymbolContent>
      <TypeContent className={typeClassName}>{symbolTextInfo.type}</TypeContent>
    </SymbolText>
  );
};

export default memo(SymbolTextComponent);
