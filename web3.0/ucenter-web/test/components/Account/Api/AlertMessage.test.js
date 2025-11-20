/**
 * Owner: willen@kupotech.com
 */
import AlertMessage from 'src/components/Account/Api/AlertMessage';
import { customRender } from 'test/setup';

describe('test AlertMessage', () => {
  test('test AlertMessage component', () => {
    const { container } = customRender(
      <>
        <AlertMessage />
        <AlertMessage useType="api" currentLang="zh_CN" />
      </>,
    );
    expect(container.innerHTML).toContain('api.intro');
  });
});
