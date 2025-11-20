/*
 * @Date: 2024-05-27 18:33:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import AppHeader from '../components/AppHeader';
import H5Header from '../components/AppHeader/H5Header';
import ProjectInfo from './components/ProjectInfo';

export const Content = styled.section`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    position: relative;
    margin-top: -69px;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    position: relative;
    max-width: 720px;
    padding-top: 90px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: -16px;
    padding-top: 0px;
    background: #fff;
    border-radius: 16px 16px 0 0;
  }
`;

export const DetailPageProjectInfo = styled(ProjectInfo)`
  padding: 60px 0 40px;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    max-width: 720px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    position: relative;
    top: 1px;
    max-width: 720px;
    padding: 0 16px 24px;
  }
`;

export const H5BottomFixedArea = styled.section`
  position: fixed;
  z-index: 2;
  bottom: 0;
  padding-bottom: 34px;
  background-color: #fff;
  width: 100%;
`;

export const DetailRoot = styled.main`
  padding-bottom: ${({ isInApp }) => (isInApp ? '130px' : '0px')};
`;

export const StyledH5Header = styled(H5Header)`
  background: #121213;
`;

export const StyledAppHeader = styled(AppHeader)`
  background: #121213;
`;
