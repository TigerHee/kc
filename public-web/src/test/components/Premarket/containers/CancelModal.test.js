/**
 * Owner: june.lee@kupotech.com
 */
import '@testing-library/jest-dom';
import { CurrencyWithUnit, InfoCard } from 'src/components/Premarket/containers/CancelModal/shared';
import { customRender } from 'src/test/setup';

jest.mock('src/components/common/NumberFormat', () => ({ children }) => <span>{children}</span>);
jest.mock('src/components/Premarket/components/Tooltip', () => ({ title, children }) => (
  <div title={title}>{children}</div>
));

describe('CurrencyWithUnit component', () => {
  const numberFormatProps = {};
  test('renders value and unit correctly', () => {
    const { getByText } = customRender(
      <CurrencyWithUnit value={1000} unit="USD" numberFormatProps={numberFormatProps} />,
    );
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('USD')).toBeInTheDocument();
  });
  test('renders negative value correctly', () => {
    const { getByText } = customRender(
      <CurrencyWithUnit value={1000} unit="USD" negative numberFormatProps={numberFormatProps} />,
    );
    expect(getByText('-')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('USD')).toBeInTheDocument();
  });
  test('renders positive value correctly', () => {
    const { getByText } = customRender(
      <CurrencyWithUnit value={1000} unit="USD" positive numberFormatProps={numberFormatProps} />,
    );
    expect(getByText('+')).toBeInTheDocument();
    expect(getByText('1000')).toBeInTheDocument();
    expect(getByText('USD')).toBeInTheDocument();
  });
  test('renders -- when value is not provided', () => {
    const { getByText } = customRender(
      <CurrencyWithUnit unit="USD" numberFormatProps={numberFormatProps} />,
    );
    expect(getByText('--')).toBeInTheDocument();
  });
  test('renders without unit', () => {
    const { getByText } = customRender(
      <CurrencyWithUnit value={1000} numberFormatProps={numberFormatProps} />,
    );
    expect(getByText('1000')).toBeInTheDocument();
  });
  test('applies custom classNames', () => {
    const { container } = customRender(
      <CurrencyWithUnit
        value={1000}
        unit="USD"
        numberFormatProps={numberFormatProps}
        classNames={{ value: 'custom-value', unit: 'custom-unit' }}
      />,
    );
    expect(container.querySelector('.custom-value')).toBeInTheDocument();
    expect(container.querySelector('.custom-unit')).toBeInTheDocument();
  });
});

describe('InfoCard component', () => {
  test('renders info items correctly', () => {
    const infoList = [
      {
        type: 'item',
        key: '1',
        title: 'Item 1',
        renderValue: () => 'Value 1',
      },
      {
        type: 'item',
        key: '2',
        title: 'Item 2',
        renderValue: () => 'Value 2',
        explainText: 'Explanation 2',
      },
    ];
    const { getByText, getByTitle } = customRender(<InfoCard infoList={infoList} />);
    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Value 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
    expect(getByText('Value 2')).toBeInTheDocument();
    expect(getByTitle('Explanation 2')).toBeInTheDocument();
  });
  test('renders divider correctly', () => {
    const infoList = [
      {
        type: 'divider',
        key: 'divider1',
      },
    ];
    const { container } = customRender(<InfoCard infoList={infoList} />);
    expect(container.querySelector('.KuxDivider-root')).toBeInTheDocument();
  });
  test('renders indented title correctly', () => {
    const infoList = [
      {
        type: 'item',
        key: '1',
        title: 'Indented Item',
        renderValue: () => 'Indented Value',
        indented: true,
      },
    ];
    const { container } = customRender(<InfoCard infoList={infoList} />);
    expect(container.querySelector('.indented')).toBeInTheDocument();
  });
  test('renders noUnderline title correctly', () => {
    const infoList = [
      {
        type: 'item',
        key: '1',
        title: 'No Underline Item',
        renderValue: () => 'No Underline Value',
      },
    ];
    const { container } = customRender(<InfoCard infoList={infoList} />);
    expect(container.querySelector('.noUnderline')).toBeInTheDocument();
  });
});
