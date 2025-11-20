import '@testing-library/jest-dom/extend-expect'; // 提供更多的断言方法
import SpanForA from 'src/components/common/SpanForA';
import { customRender } from 'test/setup';

describe('SpanForA component', () => {
  it('renders SpanForA correctly', () => {
    const { getByText } = customRender(<SpanForA>Click me</SpanForA>);

    const spanElement = getByText('Click me');
    expect(spanElement).toBeInTheDocument(); // 检查是否渲染了文本内容
  });

  it('applies additional className correctly', () => {
    const { container } = customRender(<SpanForA className="custom-class">Click me</SpanForA>);

    const spanElement = container.firstChild;
    expect(spanElement).toHaveClass('custom-class'); // 检查是否应用了自定义的 className
  });
});
