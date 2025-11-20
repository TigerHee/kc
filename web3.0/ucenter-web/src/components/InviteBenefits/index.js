/**
 * Owner: vijay.zhou@kupotech.com
 * 此组件应由增长组提供，数据和样式都 follow 福利中心
 * 由于技术架构局限和时间紧迫，由用户组参考 platform-operation-web 实现并对代码精简
 * 此组件所使用的所有资源（图片资源除外）内聚到此目录下，以便后续替换
 */
import { styled } from '@kux/mui';
import { useSelector } from 'react-redux';
import { DataProvider } from './components/Context';
import { Earn } from './components/Earn';
import { Level } from './components/Level';
import { NewcomerBonus } from './components/NewcomerBonus';

const Container = styled.div``;

export function InviteBenefits() {
  const { data: inviterInfo } = useSelector((state) => state['$entrance_signUp']?.inviter ?? {});

  if (!inviterInfo) {
    return null;
  }

  return (
    <Container>
      <DataProvider>
        <NewcomerBonus />
        <Level />
        <Earn />
      </DataProvider>
    </Container>
  );
}
