/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-26 23:02:46
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-26 23:11:38
 * @FilePath: /trade-web/_tests_/utils/routeCreator.test.js
 * @Description: 
 */
import routeCreator from 'src/utils/routeCreator';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


// Mocking dva's dynamic function
jest.mock('dva/dynamic', () => ({
    __esModule: true,
    default: () => () => <div>MockedComponent</div>,
  }));

describe('dynamicRouteGenerator', () => {
  it('generates routes correctly', () => {
    const pages = {
      '/test': {
        models: () => [import('../models/test')],
        component: () => import('../routes/Test'),
      },
    };
    const app = {}; // Mock app object
    const match = { path: '/base' }; // Mock match object

    const { container } = render(
      <MemoryRouter initialEntries={['/base/test']}>
        {routeCreator(pages, app, match)}
      </MemoryRouter>
    );

    expect(container.innerHTML).toContain('<div>MockedComponent</div>');
  });
});