/*
 * owner: Borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Checkbox } from '@kux/mui';

const { Group } = Checkbox;

const ChildrenBox = styled.div`
  display: inline-flex;
  margin-left: 6px;
`;

const MuiCheckbox = forwardRef((props, ref) => {
  const { independence, children, ...otherProps } = props;
  // 将复选框和children分开，以解决children的click操作导致复选框选中的问题
  if (independence) {
    return (
      <React.Fragment>
        <Checkbox ref={ref} {...otherProps} />
        <ChildrenBox>
          {children}
        </ChildrenBox>
      </React.Fragment>
    );
  }
  return <Checkbox ref={ref} {...otherProps}>{children}</Checkbox>;
});

MuiCheckbox.Group = Group;

export default MuiCheckbox;
