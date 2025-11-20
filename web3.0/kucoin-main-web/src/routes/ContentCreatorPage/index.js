/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui';
import Banner1 from 'components/ContentCreator/Banner1';
import Banner2 from 'components/ContentCreator/Banner2';
import Banner3 from 'components/ContentCreator/Banner3';
import Banner4 from 'components/ContentCreator/Banner4';
import Banner5 from 'components/ContentCreator/Banner5';
import Banner6 from 'components/ContentCreator/Banner6';
import Banner7 from 'components/ContentCreator/Banner7';
import Banner8 from 'components/ContentCreator/Banner8';
import Banner9 from 'components/ContentCreator/Banner9';

const Page = styled.div`
  background: #fff;
  min-height: 80vh;
`;

export default () => {
  return (
    <Page data-inspector="content_creator_page">
      <Banner1 />
      <Banner2 />
      <Banner3 />
      <Banner4 />
      <Banner5 />
      <Banner6 />
      <Banner7 />
      <Banner8 />
      <Banner9 />
    </Page>
  );
};
