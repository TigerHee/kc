/**
 * Owner: willen@kupotech.com
 */
import IpTag from 'src/components/Account/Api/IpTag';
import { customRender } from 'test/setup';

describe('test IpTag', () => {
  test('test IpTag component', () => {
    const { container } = customRender(
      <>
        <IpTag />
        <IpTag deletable ip="iptest" />
      </>,
    );
    expect(container.innerHTML).toContain('iptest');
  });
});
