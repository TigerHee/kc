/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';

import Form from '@mui/Form';

import { styled, withYScreen } from '../builtinCommon';

import CloseOnly from '../components/Advanced/CloseOnly';

const AdvancedWrapper = withYScreen(styled.div`
  margin: 10px 0 16px;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text40};
  overflow: hidden;
  height: auto;
  ${(props) =>
    props.$useCss(['md', 'sm'])(`
    margin: 5px 0 10px;
  `)}
`);

const AdvancedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const { useWatch, useFormInstance } = Form;

const CloseOnlyForm = ({ className }) => {
  const form = useFormInstance();
  const watchPnlType = useWatch('pnlType', form);

  return (
    <AdvancedWrapper className={className}>
      <AdvancedHeader>
        <CloseOnly name="closeOnly" pnlType={watchPnlType} />
      </AdvancedHeader>
    </AdvancedWrapper>
  );
};

export default React.memo(CloseOnlyForm);
