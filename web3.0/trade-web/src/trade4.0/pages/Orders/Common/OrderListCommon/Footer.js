/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { _tHTML } from 'utils/lang';
import { FooterWrapper } from './style';

const Footer = (props) => {
  const { totalNum, link } = props;
  // if (totalNum <= 30) {
  //   return null;
  // }
  return <FooterWrapper>{_tHTML('a3LDXFPErFr8D1PeFryjkn', { totalNum, link })}</FooterWrapper>;
};

export default Footer;
