/**
 * owner: larvide.peng@kupotech.com
 */
import { styled } from '@kux/mui';
import MuiDialog from 'routes/SlothubPage/components/mui/Dialog';

export const MuiDialogStyleWrapper = styled(MuiDialog)`
  .KuxModalHeader-root {
    border: none;
    ${(props) => props.theme.breakpoints.down('sm')} {
      flex-direction: row;
    }
  }
  .KuxModalHeader-root {
    padding: 32px !important;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 24px 16px !important;
    }
  }
  .KuxModalHeader-close {
    ${(props) => props.theme.breakpoints.down('sm')} {
      display: none;
    }
  }
`;
export const Title = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 4px;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
export const DescText = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
export const BannerWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 24px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 14px;
  }
`;
export const BannerTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;
export const BannerValue = styled.div`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;
