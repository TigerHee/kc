import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Statistic } from './index';

describe('Statistic Component', () => {
  it('自定义class和style', () => {
    const { container } = render(
      <Statistic value={100} className="custom-class" style={{ color: 'red' }} />
    );
    const statisticElement = container.querySelector('.kux-statistic');
    expect(statisticElement).toHaveClass('custom-class');
    //  jest-dom 会将颜色名称转换为 RGB 格式
    expect(statisticElement).toHaveStyle('color: rgb(255, 0, 0)');
  });

  it('前缀和后缀', () => {
    render(
      <Statistic
        value={100}
        prefix={<span data-testid="prefix">Prefix</span>}
        suffix={<span data-testid="suffix">Suffix</span>}
      />
    );
    expect(screen.getByTestId('prefix')).toBeInTheDocument();
    expect(screen.getByTestId('suffix')).toBeInTheDocument();
  });

  it('隐藏数值', () => {
    render(<Statistic value={100} hideAmount maskContent="***" />);
    expect(screen.queryByText('100')).not.toBeInTheDocument();
    expect(screen.getByText('***')).toBeInTheDocument();
  });
});