/**
 * Owner: will.wang@kupotech.com
 */

import { _t } from "@/tools/i18n";
import { styled, useTheme } from "@kux/mui";
import { useLocale } from '@kucoin-base/i18n';
import { useMemo } from "react";
import NoSSG from "@/components/NoSSG";
import Animated from "./components/Backgrounds/Animated";
import BgLight from 'static/about-us/about_us_header_th_light.svg';
import BgDark from 'static/about-us/about_us_header_th_dark.svg';

const Container = styled.div`
  padding: 0 0 198px;
  background-color: ${props => props.theme.colors.overlay};
  position: relative;
  overflow: hidden;

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px 140px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px 140px;
  }
`;

const Content = styled.div`
  width: 1200px;
  margin: 0 auto;
  padding-top: 146px;
  position: relative;

  background-image: url(${(props) => props.bg});
  background-size: 192px 104px;
  background-repeat: no-repeat;
  background-position: right 16px top 102px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    background-position: right 0 top 71px;
    padding-top: 92px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    background-position: right 0 top 45px;
    padding-top: 86px;
    background-size: 160px 86px;
  }
`

const Title = styled.h1`
  color: ${props => props.theme.colors.text};

  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;

  margin: 0;
  margin-bottom: 32px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const Paragraph = styled.p`
  color: ${props => props.theme.colors.text60};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;

  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const CustomAnimationBg = styled(Animated)`
  position: absolute;
  height: 600px;
  margin-top: -300px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    top: 80px;
    margin-top: unset;
    height: 100%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 200%;
    height: 100%;
    top: 90px;
    left: -50%;
    margin-left: 0;
    margin-top: unset;
  }
`

const paragraphContentMap = {
  en: {
    first: 'KuCoin Thailand ("KCTH", former trade name "ERX") under the management of ERX Co., Ltd., is a regulated digital asset and crypto exchange under the oversight of Thailand’s Securities and Exchange Commission (“SEC”). KCTH complies with strict local regulations while aligning with global standards, ensuring a secure and transparent digital finance ecosystem.',
    second: 'Continuing ERX’s mission, KuCoin Thailand aims to become Asia’s leading digital asset exchange by enhancing liquidity across major asset classes, leveraging a world-class platform, and implementing cutting-edge technologies—all while maintaining the highest standards of asset security. ',
  },
  th_TH: {
    first: 'KuCoin Thailand (“KCTH”) (ซึ่งชื่อทางการค้าเดิมคือ ERX) ภายใต้การบริหารจัดการโดยบริษัท อีอาร์เอ็กซ์ จำกัด เป็นศูนย์ซื้อขายสินทรัพย์ดิจิทัลที่ได้รับการกำกับดูแลจากสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ (“สำนักงาน ก.ล.ต.”) ของประเทศไทย KCTH ปฏิบัติตามข้อกำหนดทางกฎหมายในประเทศอย่างเคร่งครัด และสอดคล้องกับมาตรฐานสากล เพื่อสร้างระบบนิเวศการเงินดิจิทัลที่ปลอดภัยและโปร่งใส ',
    second: 'โดยสานต่อเป้าหมายของ ERX, Kucoin Thailand จะเป็นศูนย์ซื้อขายสินทรัพย์ดิจิทัลชั้นนำของเอเชีย โดยการเพิ่มสภาพคล่องของสินทรัพย์และใช้แพลตฟอร์มระดับโลกและเทคโนโลยีล้ำสมัย พร้อมทั้งให้ความสำคัญกับการรักษาความปลอดภัยของสินทรัพย์ของลูกค้าเป็นหลัก ',
  }
};

export default () => {
  const theme = useTheme();
  const { currentLang } = useLocale();
  const isDark = theme.currentTheme === 'dark';

  const bg = isDark ? BgDark : BgLight;

  const content = useMemo(() => {
    if (currentLang === 'th_TH') {
      return paragraphContentMap.th_TH;
    }

    return paragraphContentMap.en;
  }, [currentLang])

  return (
    <Container>
      <NoSSG>
        <CustomAnimationBg />
      </NoSSG>

      <Content bg={bg}>
        <Title>
          {_t('aboutus.about')}
        </Title>
        <Paragraph>
          {content.first}
          <br/>
          <br/>
          {content.second}
        </Paragraph>
      </Content>

      
    </Container>
  )
}