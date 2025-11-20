/**
 * Owner: will.wang@kupotech.com
 */
import checkicon from 'static/about-us/check_success.svg';
import {
  PrincipleWrapper,
  PrincipleWrapperGrid,
  PrincipleWrapperGridCard,
  PrincipleWrapperGridCardContent,
  PrincipleWrapperGridCardIcon,
  PrincipleWrapperTitle,
} from './principles.style';
import { _t } from '@/tools/i18n';

const list = [
  {
    title: _t('aboutus.ten.item1'),
  },
  {
    title: _t('aboutus.ten.item2'),
  },
  {
    title: _t('aboutus.ten.item3'),
  },
  {
    title: _t('aboutus.ten.item4'),
  },
  {
    title: _t('aboutus.ten.item5'),
  },
  {
    title: _t('aboutus.ten.item6'),
  },
  {
    title: _t('aboutus.ten.item7'),
  },
  {
    title: _t('aboutus.ten.item8'),
  },
  {
    title: _t('aboutus.ten.item9'),
  },
  {
    title: _t('aboutus.ten.item10'),
  },
];

export default () => {
  return (
    <PrincipleWrapper data-inspector='about_us_rules'>
      <PrincipleWrapperTitle>{_t('aboutus.ten.title')}</PrincipleWrapperTitle>

      <PrincipleWrapperGrid>
        {list.map((item) => (
          <PrincipleWrapperGridCard key={item.title}>
            <PrincipleWrapperGridCardIcon src={checkicon} alt="check icon" />
            <PrincipleWrapperGridCardContent>{item.title}</PrincipleWrapperGridCardContent>
          </PrincipleWrapperGridCard>
        ))}
      </PrincipleWrapperGrid>
    </PrincipleWrapper>
  );
};
