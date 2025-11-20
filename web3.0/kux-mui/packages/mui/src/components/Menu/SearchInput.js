import React, { useState } from 'react';
import { styled } from 'emotion/index';
import useTheme from 'hooks/useTheme';
import map from 'lodash-es/map';
import { ICSearchOutlined } from '@kux/icons';
import Dropdown from '../Dropdown';
import Input from '../Input';

const OverlayWrapper = styled.div`
  position: absolute;
  border-radius: 8px;
  overflow: hidden;
  top: 8px;
  left: 0;
  width: 100%;
  height: unset;
  background: ${(props) => props.theme.colors.layer};
  box-shadow: ${(props) =>
      props.theme.currenTheme === 'light' ? props.theme.colors.cover4 : 'transparent'}
    0px 4px 40px;
  border: 1px solid ${(props) => props.theme.colors.cover4};
`;

const List = styled.div`
  margin: 0px;
  flex: 1;
  padding-bottom: unset;
  max-height: 240px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    width: 100%;
    height: auto;
    border-radius: 3px;
    background: ${(props) => props.theme.colors.text20};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text60};
  }
`;

const ListItem = styled.div`
  padding: 11px 16px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
  }
`;

const Highlight = styled.span`
  color: ${(props) => props.theme.colors.primary};
`;

const DropdownWrapper = styled.li`
  width: 100%;
  margin-bottom: 8px;
  position: relative;
`;

const CusDropdown = styled(Dropdown)`
  display: flex;
  flex-direction: column;
  .customDropdown {
    transform: translate(0px, 38px) !important;
    width: 100%;
  }
`;

function Overlay({ keyword, theme, options, onItemClick }) {
  const highlightText = (text) => {
    if (!keyword.trim()) {
      return text;
    }
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        // eslint-disable-next-line react/no-array-index-key
        <Highlight theme={theme} key={index}>
          {part}
        </Highlight>
      ) : (
        part
      ),
    );
  };

  return (
    <OverlayWrapper theme={theme}>
      <List theme={theme}>
        {map(options, (item) => (
          <ListItem theme={theme} key={item.key} onClick={() => onItemClick(item.key)}>
            {highlightText(item.label)}
          </ListItem>
        ))}
      </List>
    </OverlayWrapper>
  );
}

export default function SearchInput({ options, onChange, dropdownProps, inputProps }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const theme = useTheme();

  const handleClickItem = (key) => {
    setVisible(false);
    onChange(key);
  };

  return (
    <DropdownWrapper>
      <CusDropdown
        visible={visible}
        trigger="click"
        overlay={
          <Overlay keyword={value} onItemClick={handleClickItem} options={options} theme={theme} />
        }
        popperClassName="customDropdown"
        placement="bottom-start"
        onVisibleChange={(v) => setVisible(v)}
        {...dropdownProps}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="medium"
          prefix={<ICSearchOutlined size={20} color={theme.colors.text40} />}
          placeholder="Search"
          allowClear
          {...inputProps}
        />
      </CusDropdown>
    </DropdownWrapper>
  );
}
