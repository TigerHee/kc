/**
 * Owner: mike@kupotech.com
 */
import CollapseTransition from '@kux/mui/Collapse';
import React, { useState, useImperativeHandle } from 'react';
import Popover from './Popover';
import { _t, _tHTML } from 'Bot/utils/lang';
import styled from '@emotion/styled';
import { MIcons } from './Icon';
import { Text, Flex } from '../Widgets';
import { css } from '@emotion/css';
import { MText } from './LabelPopover';

const InfoContent = ({ infoContentKeys = [] }) => {
  return infoContentKeys.map((item, index) => {
    return (
      <MText key={index}>
        <div>{_t(item[0])}</div>
        <p>{_tHTML(item[1])}</p>
      </MText>
    );
  });
};
const gap = css`
  column-gap: 24px;
`;
export default React.forwardRef(
  ({ children, className, onFold, defaultValue = false, infoContentKeys }, ref) => {
    const [open, setOpen] = useState(defaultValue);
    const toggle = (_) => {
      onFold && onFold();
      setOpen(!open);
    };
    useImperativeHandle(
      ref,
      () => {
        return {
          setOpen,
        };
      },
      [],
    );

    return (
      <>
        <Flex vc sb fs={12} cursor className={`${className} ${gap}`}>
          <Flex onClick={toggle} vc className="high-setting-label">
            <Text color="text40">{_t('gridform20')}</Text>
            {open ? (
              <MIcons.TriangleUp size={12} color="icon" />
            ) : (
              <MIcons.TriangleDown size={12} color="icon" />
            )}
          </Flex>

          {infoContentKeys && (
            <Popover placement="top" content={<InfoContent infoContentKeys={infoContentKeys} />}>
              <MIcons.InfoContained size={16} color="icon60" />
            </Popover>
          )}
        </Flex>

        <CollapseTransition in={open} timeout={300}>
          <div className="pt-8">{children}</div>
        </CollapseTransition>
      </>
    );
  },
);
