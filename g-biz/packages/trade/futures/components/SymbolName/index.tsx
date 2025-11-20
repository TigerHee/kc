/**
 * owner@clyne@kupotech.com
 */
import React, { FC, memo } from 'react';
import clsx from 'clsx';
import withWrapper from '../../hocs/withWrapper';
import { useGetSymbolText } from '../../hooks/useGetSymbolText';
import { SymbolNameProps } from '../../types/contract';
import { Wrapper, Content, ContentTag } from './style';
import { VARIANT_TAG } from '../../constant';

const SymbolName: FC<SymbolNameProps> = ({
  symbol,
  className,
  size = 'basic',
  variant = 'text',
}) => {
  const isTag = variant === VARIANT_TAG;
  const { symbolName, tagName } = useGetSymbolText({ symbol, isTag });
  let child = (
    <Content className={className} dir="ltr">
      <span className="symbol-name">{symbolName}</span>
    </Content>
  );
  if (variant === VARIANT_TAG) {
    child = (
      <ContentTag className={className}>
        <div className="symbol-name">{symbolName}</div>
        <div className="symbol-tag">{tagName}</div>
      </ContentTag>
    );
  }

  return <Wrapper className={clsx(size)}>{child}</Wrapper>;
};

const MemoizedSymbolName = memo(SymbolName);

export default withWrapper(MemoizedSymbolName);
