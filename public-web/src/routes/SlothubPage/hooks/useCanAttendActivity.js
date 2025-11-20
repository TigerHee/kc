/*
 * @owner: borden@kupotech.com
 */
import { useSelector } from 'src/hooks/useSelector';

export default function useCanAttendActivity() {
  const user = useSelector((state) => state.user.user);

  return Boolean(user && !user.isSub);
}
