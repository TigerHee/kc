/**
 * Owner: will.wang@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import {
  JoinbannerWrapper,
  JoinbannerWrapperButton,
  JoinbannerWrapperParagraph,
  JoinbannerWrapperTitle,
} from './joinbanner.style';
import StarBg from './components/StarBg';
import { _t, addLangToPath } from '@/tools/i18n';
import { useCallback } from 'react';
import { useResponsive } from '@kux/mui';

export default () => {
  const rs = useResponsive();
  const isSm = !rs.sm;

  const handleJoinUs = useCallback(() => {
    window.open(addLangToPath("/careers"));
  }, []);

  return (
    <JoinbannerWrapper>
      <StarBg />
      <JoinbannerWrapperTitle>
        {_t('639afd5beda54000a272')}
      </JoinbannerWrapperTitle>

      <JoinbannerWrapperParagraph>
        {_t('67f9cb69ac0e4000a169')}
      </JoinbannerWrapperParagraph>

      <JoinbannerWrapperButton size={isSm ? "basic" : "large"} endIcon={<ICArrowRight2Outlined size={isSm ? 16 : 20} />} onClick={handleJoinUs}>
        {_t('5d01bcc193c54000a0c1')}
      </JoinbannerWrapperButton>
    </JoinbannerWrapper>
  );
};
