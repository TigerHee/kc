import { toast } from '@kux/design';

const showReponseError = (e?: any) => {
  const message = e?.response?.data?.msg || e?.data?.msg || e?.message || '';
  if (message) {
    toast.info(message);
  }
};

export { showReponseError };
