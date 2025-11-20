import systemDynamic from 'src/utils/systemDynamic';
import { customRender as render } from 'test/setup';

test('test dynamic', () => {
  const Index = systemDynamic('@kucoin-gbiz-next/entrance', 'Index');
  const { asFragment } = render(<Index />);
  expect(asFragment()).toMatchSnapshot();
});
