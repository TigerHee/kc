import { useModel } from '@umijs/max';

const useUser = () => {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.currentUser;
  const isAdmin = user?.role === 'admin';
  return {
    isAdmin,
  };
};

export default useUser;
