/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/styled';

const TitleWrapper = styled.div`
  width: 100%;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 16px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 0px;
    padding: 0;
  }
`;
const Title = styled.div`
  width: 100%;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;
const TableWrapper = styled.div`
  width: 100%;
  th {
    padding: 12px 0px;
  }
  & td {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
  }
  .KuxEmpty-img {
    width: 136px;
    height: unset;
  }
`;

const ExpandTable = styled.div`
  .KuxTable-root tr:last-child td {
    border-bottom: none;
  }
`;
const Opt = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .deviceIcon {
    display: flex;
  }
`;
const DeviceIcon = styled.div`
  width: 13px !important;
  height: 13px !important;
  margin: 0;
`;

const MiniTableWrapper = styled.div`
  padding: 0 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px;
    & .titleUnitValue {
      justify-content: flex-start;
    }
  }
`;

const Cell_icon = styled.div`
  display: flex;
  align-items: center;
`;

const NoneContentTip = styled.div`
  padding-top: 24px;
  padding-bottom: 32px;
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  .text-center {
    text-align: center;
  }
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RemoveBtn = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text40 : theme.colors.text)};
  cursor: ${({ disabled }) => (disabled ? 'unset' : 'pointer')};
`;

const ExpandIconWrapper = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

export {
  TitleWrapper,
  Title,
  ExpandTable,
  TableWrapper,
  Opt,
  DeviceIcon,
  MiniTableWrapper,
  Cell_icon,
  NoneContentTip,
  RemoveBtn,
  ExpandIconWrapper,
};
