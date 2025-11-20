/**
 * Owner: terry@kupotech.com
 */
import { CompliantBox, useCompliantShow, useCompliantShowWithInit } from 'gbiz-next/compliantCenter';
import { useTheme } from '@kux/mui';
import { isEqual } from 'lodash-es';
import { useSelector } from 'src/hooks/useSelector';

export default ({ children, ...rest } = {}) => {
  const user = useSelector((state) => state.user.user, isEqual);
  const theme = useTheme();

  // CompliantBox加载异常-兜底
  if (!CompliantBox) return children;
  return (
    <CompliantBox theme={theme.currentTheme} userInfo={user} {...rest}>
      {children}
    </CompliantBox>
  );
};

export { useCompliantShow, useCompliantShowWithInit };
