/**
 * Owner: jesse.shao@kupotech.com
 */
import { useEffect, useState, useCallback } from 'react';
import Banner from './Banner';
import GuardTab from './GuardTab';
import RenderCMS from './RenderCMS';

export default () => {
  return (
    <div>
      <Banner />

      <div>
        <GuardTab />
      </div>
    </div>
  );
};
