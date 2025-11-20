/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { _t } from 'src/tools/i18n';
import statusDarkIcon from 'static/account/kyc/brandUpgrade/kycStatus/verified.dark.png';
import statusIcon from 'static/account/kyc/brandUpgrade/kycStatus/verified.png';
import { Button, Container, Desc, Gap, Img, Title } from './components/styled';

export default ({ isDark, title, desc, btnText, onClick }) => {
  return (
    <Container>
      <Gap distance={8}>
        <Img src={isDark ? statusDarkIcon : statusIcon} />
        <Title>{title ?? _t('5d20aa9352cb4000a508')}</Title>
        <Desc>{desc ?? _t('d56b2ef455a44000a5bc')}</Desc>
      </Gap>
      {btnText ? (
        <Button size="large" fullWidth onClick={onClick}>
          <span>{btnText}</span>
          <ICArrowRight2Outlined size={16} />
        </Button>
      ) : null}
    </Container>
  );
};
