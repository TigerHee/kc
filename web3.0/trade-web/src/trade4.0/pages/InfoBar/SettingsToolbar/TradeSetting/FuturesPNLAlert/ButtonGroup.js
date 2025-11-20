/**
 * Owner: clyne@kupotech.com
 */
import React, { memo } from 'react';
import Button from '@mui/Button';
import { styled } from '@/style/emotion';
import { map } from 'lodash';
import { floadToPercent } from '@/utils/format';
import { dividedBy } from 'src/utils/operation';

const ButtonGroupBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  .item-button {
    width: calc((100% - 28px) / 5);
    border-radius: 8px;
    color: ${(props) => props.theme.colors.text60};
    background-color: ${(props) => props.theme.colors.cover4};
  }
  .item-button + .item-button {
    margin-left: 7px;
  }
  .active {
    background-color: ${(props) => props.theme.colors.cover8};
  }
`;

const ButtonGroup = ({ value: active, config, onChange = () => {} }) => {
  return (
    <ButtonGroupBox className="group-items" value={active}>
      {map(config, ({ value, label }) => {
        const isActive = value === active;
        const activeClass = isActive ? 'active' : '';
        return (
          <Button
            className={`item-button ${activeClass}`}
            size="mini"
            variant="contained"
            type="default"
            key={value}
            value={value}
            onClick={(e) => {
              onChange(value, e);
            }}
          >
            {floadToPercent(dividedBy(value)(100).toString(), { isPositive: false })}
          </Button>
        );
      })}
    </ButtonGroupBox>
  );
};

export default memo(ButtonGroup);
