/**
 * Owner: Clyne@kupotech.com
 */
import React from 'react';
import { MoreWrapper, DropdownExtend, MoreText } from './style';
import DropdownSelect from 'src/trade4.0/components/DropdownSelect';
import { MoreIcon } from './Icon';
import { useMore } from './hooks/useMore';

/**
 * more 图标label展示
 */
const renderLabel = () => (
  <MoreWrapper>
    <MoreIcon />
  </MoreWrapper>
);

const More = () => {
  const { configs } = useMore();

  if (configs.length === 0) {
    return <></>;
  }

  return (
    <MoreText className="ticker-more">
      <DropdownSelect
        extendStyle={DropdownExtend}
        configs={configs}
        isShowArrow={false}
        renderLabel={renderLabel}
      >
        <div />
      </DropdownSelect>
    </MoreText>
  );
};

export default More;
