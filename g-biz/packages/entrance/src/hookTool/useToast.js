/**
 * Owner: iron@kupotech.com
 */
import { useSnackbar } from '@kux/mui';

export default function useToast() {
  const { message } = useSnackbar();
  return message;
}
