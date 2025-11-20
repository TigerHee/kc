/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';
const { Wrapper, Title, SubTitle, LottieIcon } = require('./Status/style');

const TransferringBox = styled.div`
  padding: 22vh 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CustomTitle = styled(Title)`
  font-size: 24px;
  text-align: center;
`;

/**
 * 中间等待界面
 * @property {string | ReactNode} title - 卡片标题
 * @property {string | ReactNode} subTitle - 卡片副标题
 * @returns
 */
const AwaitContainer = (props) => {
  const { title = '', subTitle = '' } = props || {};

  return (
    <Wrapper>
      <TransferringBox>
        <LottieIcon iconName="wait" />
        {!!title && <CustomTitle>{title}</CustomTitle>}
        {!!subTitle && <SubTitle>{subTitle}</SubTitle>}
      </TransferringBox>
    </Wrapper>
  );
};

export default AwaitContainer;
