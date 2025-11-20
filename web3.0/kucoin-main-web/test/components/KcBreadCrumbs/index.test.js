/**
 * owner: larvide.peng@kupotech.com
 */

import React from 'react';
import BreadCrumbs from 'components/KcBreadCrumbs';
import { customRender } from 'test/setup';

describe('test components KcBreadCrumbs', () => {
  test('test components KcBreadCrumbs', () => {
    const breadCrumbs = [
      {
        label: '45814d1e153e4000ac97',
        url: '/security',
      }
    ];
    const { getByText } = customRender(<BreadCrumbs breadCrumbs={breadCrumbs} />);

    expect(getByText('45814d1e153e4000ac97')).toBeInTheDocument();
  });

  test('test components KcBreadCrumbs with no breadCrumbs', () => {
    const breadCrumbs = [];
    const { queryByText } = customRender(<BreadCrumbs breadCrumbs={breadCrumbs} />);

    expect(queryByText('45814d1e153e4000ac97')).toBeNull();
  });
});
