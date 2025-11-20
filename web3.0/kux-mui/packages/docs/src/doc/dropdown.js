/**
 * Owner: victor.ren@kupotech.com
 */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { styled, Dropdown, Dialog } from '@kux/mui';
import Wrapper from './wrapper';

const CusDropdown = styled(Dropdown)`
  color: ${(props) => (props.visible ? 'red' : 'yellow')};
`;

const style = { height: '48px', lineHeight: '48px', textAlign: 'center', cursor: 'pointer' };

export default () => {
  const [visible, setVisible] = React.useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Wrapper>
      <CusDropdown
        onVisibleChange={setVisible}
        visible={visible}
        trigger="click"
        overlay={
          <ul
            style={{
              background: '#000',
              color: '#fff',
              margin: 0,
              listStyle: 'none',
              padding: 0,
              width: '100px',
            }}
          >
            <li onClick={() => setShowDialog(true)} style={style}>
              1
            </li>
            <li style={style}>2</li>
            <li style={style}>3</li>
            <li style={style}>4</li>
          </ul>
        }
      >
        <a>212122121212</a>
      </CusDropdown>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        show Dialog
      </Dialog>
    </Wrapper>
  );
};
