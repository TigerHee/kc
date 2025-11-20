/**
 * Owner: eli.xiang@kupotech.com
 */
import { styled, Button } from '@kux/mui';
import { useLang } from '../../../hookTool';

const NextButton = styled(Button)`
  margin-right: 16px;
  margin-top: 16px; // 需要总体 40px，但是上面表单已经有了 24，所以这里改为 16px
`;

export default function FirstNextBtn({ onClick, loading }) {
  const { t } = useLang();

  return (
    <NextButton
      id="login_next_btn"
      onClick={onClick}
      fullWidth
      size="large"
      loading={loading}
      data-inspector="signin_next_btn"
    >
      {t('next')}
    </NextButton>
  );
}
