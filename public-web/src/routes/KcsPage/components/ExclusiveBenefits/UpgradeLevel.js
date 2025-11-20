/**
 * Owner: chris@kupotech.com
 */
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import LevelTable from '../LevelTable';

const Container = styled.div`
  width: 100%;
  position: relative;
  padding: 68px 0px 32px;
  .levelTitle {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
    text-align: center;
  }
  .levelDesc {
    margin: 16px 0px 24px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 20px;
    line-height: 150%;
    text-align: center;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 48px 0px 16px;
    .levelTitle {
      font-size: 24px;
    }
    .levelDesc {
      font-size: 16px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 0px 8px;
    .levelTitle {
      font-size: 18px;
    }
    .levelDesc {
      font-size: 14px;
    }
  }
`;

function UpgradeLevel(props) {
  return (
    <Container>
      <div className="levelTitle">{_t('0354e85414eb4000a8de')}</div>
      <div className="levelDesc">
        <div>{_t('01d1dc6890d64000a00a')}</div>
        <div>{_t('8f544654a8be4000a732')}</div>
      </div>
      <LevelTable />
    </Container>
  );
}
export default UpgradeLevel;
