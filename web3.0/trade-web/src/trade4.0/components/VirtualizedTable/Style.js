/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { styled, fx } from '@/style/emotion';

export const TableWrapper = styled.div`
  ${fx.width('100', '%')}
  ${fx.height('100', '%')}
  ${fx.wordBreak('break-all')}
`;

export const HeaderWrapper = styled.div`
  ${fx.width('100', '%')}
  ${fx.display('flex')}
  ${fx.maxHeight(40)}
  ${fx.minHeight(28)}
  ${fx.paddingTop('3')}
  ${fx.paddingBottom('3')}
  ${fx.alignItems('center')}
  ${(props) => fx.color(props, 'text40')}
  ${(props) => `box-shadow: 0px -0.5px 0px 0px ${props.theme.colors.cover12} inset`}
`;

export const HeaderItem = styled.div`
  ${fx.paddingLeft('6')}
  ${fx.paddingRight('6')}
  ${fx.flexShrink('0')}
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
`;

export const WholeLineItemWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.margin(0)}
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${(props) => fx.color(props, 'text60')}
  ${fx.paddingTop('3')}
  ${fx.paddingBottom('3')}
  ${fx.borderBottom('1px solid')}
  ${(props) => fx.borderColor(props.theme.colors.divider8)}
`;

export const WholeLineItem = styled.div`
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${(props) => fx.color(props, 'text60')}
  ${fx.paddingLeft('6')}
  ${fx.paddingRight('6')}
  ${fx.flexShrink('0')}
`;
