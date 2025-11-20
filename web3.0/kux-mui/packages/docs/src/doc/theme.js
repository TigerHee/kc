import React from 'react';
import { Table } from '@kux/mui';
import { useTheme } from '@kux/mui/lib/hooks';
import Wrapper from './wrapper';

const createData = (color, value) => {
  return { color, value };
};

const rows = (colors) => {
  const colorKeys = Object.keys(colors);
  return colorKeys.map((item) => createData(colors[item], item));
};

const colorColumns = [
  {
    title: '颜色',
    dataIndex: 'color',
    width: 400,
    align: 'left',
  },
  {
    dataIndex: 'value',
    title: '值',
    align: 'left',
  },
  {
    title: '参考',
    align: 'left',
    render: ({ color, value }) => {
      return (
        <div
          style={{
            background: color,
            width: '140px',
            height: '40px',
            lineHeight: '40px',
            textAlign: 'center',
          }}
        >
          {value}
        </div>
      );
    },
  },
];

function Demo() {
  const theme = useTheme();
  const colorsArr = rows(theme.colors);
  return (
    <div style={{ height: 800, overflow: 'auto', marginTop: 100 }}>
      <Table dataSource={colorsArr} columns={colorColumns} rowKey={() => Math.random()} />
    </div>
  );
}

export default () => {
  return (
    <Wrapper>
      <Demo />
    </Wrapper>
  );
};
