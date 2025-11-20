/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import Button from '@mui/Button';
import SvgComponent from '@/components/SvgComponent';

/** 样式开始 */
const Describe = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: ${props => props.theme.colors.text30};
`;
const ButtonGroup = styled.div`
  display: flex;
`;
/** 样式结束 */

const Placeholder = React.memo(({ iconId, describe, dockPopout, showPopout }) => {
  const { colors } = useTheme();
  return (
    <div className="flexlayout__center_box">
      <div style={{ textAlign: 'center' }}>
        <SvgComponent type={iconId} size={64} color={colors.icon60} />
        <Describe>{describe}</Describe>
        {
          Boolean(dockPopout, showPopout) && (
            <ButtonGroup>
              <Button variant="text" as="a" onClick={showPopout}>
                Show window
              </Button>
              <Button variant="text" as="a" onClick={dockPopout} style={{ marginLeft: 34 }}>
                Dock window
              </Button>
            </ButtonGroup>
          )
        }
      </div>
    </div>
  );
});

export default Placeholder;
