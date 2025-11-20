/*
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui';
import { _t, _tHTML } from 'tools/i18n';

const Wrap = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 20px;
  height: 26px;
  line-height: 130%;
  /* color: ${(props) => props.theme.colors.primary}; */
  color: #25af91;
  align-items: center;

  .border {
    width: 1px;
    height: 20px;
    margin: 0 20px;
    /* background: #01bc8d; */
    background: #25af91;
    border-radius: 2px;
    opacity: 0.4;
  }
`;

export const LogoSuffixUI = ({}) => {
  return (
    <Wrap className="logo-suffix">
      <div className="border" />
      <div className="suffix">{_t('879gDBrwKLCUmN9RjTBM4M')}</div>
    </Wrap>
  );
};
