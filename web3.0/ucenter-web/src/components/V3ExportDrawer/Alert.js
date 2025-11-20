/**
 * Owner: tiger@kupotech.com
 */
import { Alert, styled } from '@kux/mui';
import React from 'react';

const AlertInfoContent = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  b {
    font-weight: 700;
  }
`;

export const AlertInfo = React.memo(({ infoList, showIdx = true, ...props }) => {
  return (
    <Alert
      showIcon={false}
      type="warning"
      description={
        <>
          {infoList.map((v, i) =>
            showIdx ? (
              <AlertInfoContent key={v}>
                {i + 1}.{v}
              </AlertInfoContent>
            ) : (
              <AlertInfoContent key={v}>{v}</AlertInfoContent>
            ),
          )}
        </>
      }
      {...props}
    />
  );
});

export default AlertInfo;
