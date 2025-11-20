/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import { ICHookOutlined } from '@kux/icons';
import useTheme from 'hooks/useTheme';
import { StyledOptionItemContent, StyledOptionItemIcon } from './StyledComps';
import { usePanelClassNames } from './useClassNames';

export default function RenderFunctionOrNode({
  nodeOrFun,
  renderInput,
  selected,
  size,
  single,
  className,
}) {
  const theme = useTheme();
  const _classNames = usePanelClassNames();
  const isFun = typeof nodeOrFun === 'function';
  return (
    <>
      <StyledOptionItemContent
        className={clsx(_classNames.itemLabel, className)}
        single={single}
        renderInput={renderInput}
        size={size}
        theme={theme}
      >
        {isFun ? nodeOrFun(renderInput, selected) : nodeOrFun}
      </StyledOptionItemContent>
      {!isFun && selected && !renderInput ? (
        <StyledOptionItemIcon className={_classNames.itemIcon}>
          <ICHookOutlined theme={theme.colors.primary} size={16} />
        </StyledOptionItemIcon>
      ) : null}
    </>
  );
}
