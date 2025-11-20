import styled, {css} from '@emotion/native';

export const ApplyTraderTopAreaImageBgWrap = styled.ImageBackground`
  min-height: 648px;
  padding-top: ${({topPaddingHeight}) => topPaddingHeight + 'px'};
`;

export const styles = {
  applyTraderTopAreaImage: css`
    height: 648px;
    width: 375px;
    position: absolute;
    top: 0;
    left: 0;
  `,
};
