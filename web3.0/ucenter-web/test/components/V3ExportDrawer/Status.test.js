import Status from 'src/components/V3ExportDrawer/Status';
import { customRender } from 'test/setup';

const theme = {
  colors: {},
};

describe('test Status', () => {
  test('test Status', () => {
    customRender(<Status statu="other" theme={theme} />, {});
  });
});
