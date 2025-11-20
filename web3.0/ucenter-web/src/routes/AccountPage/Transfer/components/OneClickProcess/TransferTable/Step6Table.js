/**
 * Owner: eli@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import { useSelector } from 'react-redux';
import NumberFormat from 'src/components/common/NumberFormat';
import { _t } from 'src/tools/i18n';
import CommonTable from '../components/CommonTable';
import H5Table, { RenderText } from '../components/H5CommonTable';

const FlexValueText = styled.div`
  display: flex;
  gap: 4px;
`;

const columns = [
  {
    title: _t('6MC1q8Lv492spcf71mMJvK'),
    dataIndex: 'currency',
    key: 'currency',
    width: '25%',
    render: (text) => {
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <CoinIcon currency={text} />
          <span>{text}</span>
        </div>
      );
    },
  },
  {
    title: _t('amount.total'),
    dataIndex: 'totalAmount',
    key: 'totalAmount',
    width: '25%',
    render: (text) => <NumberFormat>{text}</NumberFormat>,
  },
  {
    title: _t('amount.enabled'),
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: '25%',
    render: (text) => <NumberFormat>{text}</NumberFormat>,
  },
];

const h5Columns = columns.map((col) => {
  if (col.dataIndex === 'currency') {
    return {
      ...col,
      render: (text) => {
        return (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            <CoinIcon currency={text} style={{ width: 16, height: 16 }} />
            <span>{text}</span>
          </div>
        );
      },
    };
  }
  return {
    ...col,
    render: (text, record) => {
      return (
        <RenderText column={col} record={record}>
          <FlexValueText>
            <NumberFormat>{text}</NumberFormat>
          </FlexValueText>
        </RenderText>
      );
    },
  };
});

export default function Step6Table({ data }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const dataSource = data?.assetList || [];

  const total = dataSource.length || 0;

  return isH5 ? (
    <H5Table columns={h5Columns} dataSource={dataSource} pagination={{ total }} />
  ) : (
    <CommonTable columns={columns} dataSource={dataSource} pagination={{ total }} />
  );
}

const CoinIcon = ({ currency, style }) => {
  const categories = useSelector((state) => state.categories);
  const { iconUrl } = categories[currency] || {};
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={currency}
        width={24}
        height={24}
        style={{ borderRadius: '50%', ...style }}
      />
    );
  }
  return null;
};
