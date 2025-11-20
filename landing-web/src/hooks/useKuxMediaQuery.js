import { useMediaQuery } from '@kux/mui/hooks';

/**
 * Owner: lucas.l.lu@kupotech.com
 * @description 基于 kux 标准断点的 MediaQuery
 */
export function useKuxMediaQuery() {
  const downLg = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const downSm = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const upLg = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));

  return {
    downLg,
    downSm,
    upLg,
    upSm,
  };
}
