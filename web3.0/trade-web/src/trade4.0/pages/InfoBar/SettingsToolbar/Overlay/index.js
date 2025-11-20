/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, Fragment } from 'react';
import { UlWrapper, ItemWrapper, ItemText, SvgWrapper } from './style';
import SvgComponent from '@/components/SvgComponent';

/**
 * Overlay
 */
const Overlay = (props) => {
  const { onItemClick, options, ...restProps } = props;

  return (
    <Fragment>
      <UlWrapper {...restProps}>
        {options.map(({ fileName, icon, iconComp, text, type }) => (
          <ItemWrapper key={text} onClick={() => onItemClick(type)}>
            <SvgWrapper>
              {iconComp || <SvgComponent fileName={fileName} type={icon} />}
            </SvgWrapper>
            <ItemText>{text}</ItemText>
          </ItemWrapper>
        ))}
      </UlWrapper>
    </Fragment>
  );
};

export default memo(Overlay);
