/*
 * @owner: borden@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import loadable from '@loadable/component';

const ButtonGroup = loadable(() => import('./ButtonGroup'));

const ButtonGroupEntry = (props) => {
  const { sm } = useResponsive();

  if (!sm) return null;
  return <ButtonGroup {...props} />;
};

export default ButtonGroupEntry;
