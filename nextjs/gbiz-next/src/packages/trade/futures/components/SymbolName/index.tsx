/**
 * owner@clyne@kupotech.com
 */
import clsx from 'clsx';
import { FC, memo } from 'react';
import withWrapper from '../../hocs/withWrapper';
import { useGetSymbolText } from '../../hooks/useGetSymbolText';
import { SymbolNameProps } from '../../types/contract';
// import { Wrapper, Content, ContentTag } from './style';
import { VARIANT_TAG } from '../../constant';
import styles from './styles.module.scss';

const SymbolName: FC<SymbolNameProps> = ({
  symbol,
  className,
  size = 'basic',
  variant = 'text',
}) => {
  const isTag = variant === VARIANT_TAG;
  const { symbolName, tagName } = useGetSymbolText({ symbol, isTag });
  let child = (
    <div className={`${styles['futures-symbol-content']} ${className}`} dir="ltr">
      <span className="symbol-name">{symbolName}</span>
    </div>
  );
  if (variant === VARIANT_TAG) {
    child = (
      <div className={`${styles['futures-symbol-ContentTag']} ${className}`}>
        <div className="symbol-name">{symbolName}</div>
        <div className="symbol-tag">{tagName}</div>
      </div>
    );
  }

  return <div className={`${styles['futures-symbol-wrapper']} ${clsx(size)}`}>{child}</div>;
};

const MemoizedSymbolName = memo(SymbolName);

export default withWrapper(MemoizedSymbolName);
