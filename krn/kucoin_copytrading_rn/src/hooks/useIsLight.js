import {useTheme} from '@krn/ui';

export const useIsLight = () => {
  const {type} = useTheme();
  return type === 'light';
};
