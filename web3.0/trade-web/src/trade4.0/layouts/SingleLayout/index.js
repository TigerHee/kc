/*
  * owner: borden@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'dva';
import styled from '@emotion/styled';
import { useResponsive } from '@kux/mui';
import InfoBar from '@/pages/InfoBar';
import MInfoBar from '@/pages/InfoBar/MIndex';
import { MODULES_MAP } from '../moduleConfig';
import { getSingleModule } from '../utils';

/** 样式开始 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const InfoBarBox = styled.section`
  margin-bottom: 3px;
`;
const LayoutBox = styled.main`
  flex: 1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: ${props => props.theme.colors.overlay};
`;
const Header = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.theme.colors.text};
  border-bottom: 1px solid ${props => props.theme.colors.divider4};
`;
const Tab = styled.div`
  height: 100%;
  display: flex;
  padding: 0 8px;
  font-size: 13px;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: ${props => props.theme.colors.cover4};
  border-right: 1px solid ${props => props.theme.colors.divider4};
`;
const Content = styled.div`
  flex: 1;
  position: relative;
`;
/** 样式结束 */

const SingleLayout = React.memo(() => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { moduleId } = getSingleModule();

  useEffect(() => {
    dispatch({
      type: 'setting/updateInLayoutIdMap',
      payload: { [moduleId]: 1 },
      override: true,
    });
  }, [moduleId]);

  const {
    renderName = () => null,
    getComponent = () => null,
    ...other
  } = MODULES_MAP[moduleId] || {};

  return (
    <Container>
      <InfoBarBox>
        {sm ? <InfoBar /> : <MInfoBar />}
      </InfoBarBox>
      <LayoutBox>
        <Container>
          <Header><Tab>{renderName()}</Tab></Header>
          <Content>{getComponent({ renderName, ...other })}</Content>
        </Container>
      </LayoutBox>
    </Container>
  );
});

export default SingleLayout;
