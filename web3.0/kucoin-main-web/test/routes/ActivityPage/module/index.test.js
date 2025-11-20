/**
 * Owner: melon@kupotech.com
 */

import { customRender } from 'test/setup';

import React from 'react';
import RulePage from 'src/routes/ActivityPage/module/Rules/index.js';
import GradientCard from 'src/routes/ActivityPage/module/GradientCard/index.js';
import Gift from 'src/routes/ActivityPage/module/Gift/index.js';
import CommonTitle from 'src/routes/ActivityPage/module/CommonTitle/index.js';
import BaseTable from 'src/routes/ActivityPage/module/BaseTable/index.js';
import Award from 'src/routes/ActivityPage/module/Award/index.js';

jest.mock('@kucoin-base/i18n');

const baseState = {
  user: {
    user: { nickname: 'Melon' },
  },
};


describe('src/routes/ActivityPage/module ', () => {
  test('/Rule: RulePage render', () => {
    customRender(<RulePage />);
  });

  test('/GradientCard: GradientCard render', () => {
    const { container } = customRender(
      <GradientCard>
        <div>test</div>
      </GradientCard>,
    );
    expect(container.innerHTML).toContain('test');
  });

  test('/Gift: Gift render', () => {
    const { container } = customRender(<Gift rewardRule={'test'} />);
    expect(container.innerHTML).toContain('activity.rewards');
  });

  test('/CommonTitle: CommonTitle render', () => {
    const { container } = customRender(
      <CommonTitle
        title={'CommonTitle'}
        startTime="1676268636571"
        endTime="1776268636571"
        status={1}
      />,
    );
    expect(container.innerHTML).toContain('CommonTitle');
  });

  test('/BaseTable: BaseTable render', () => {
    const columns = [
      {
        title: 'name',
        dataIndex: 'name',
        align: 'center',
      },
    ];

    const dataSource = [
      {
        id: 1,
        name: 'testName',
      },
    ];

    const { container } = customRender(
      <BaseTable rowKey="id" columns={columns} dataSource={dataSource} />,
    );
    expect(container.innerHTML).toContain('testName');
  });

  test('/Award: Award render when no user', () => {
    const { container } = customRender(
      <Award
        activityData={{
          status: 1,
        }}
      />,
    );
    expect(container.innerHTML).toContain('');

    const { container: noLoginContainer } = customRender(
      <Award
        activityData={{
          status: 3,
        }}
      />,
    );
    expect(noLoginContainer.innerHTML).toContain('prize.detail');
  });
});
