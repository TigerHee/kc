/**
 * owner: larvide.peng@kupotech.com
 */
import { ICTriangleBottomOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';
import { rulesStepsConfig } from './config';

const StepFlexBox = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  margin: 8px 0;
`;
const Box = styled.div`
  display: flex;
`;
const StepFlexItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Image = styled.img`
  width: 28px;
  margin-bottom: 4px;
`;
const Text = styled.span`
  text-align: center;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  padding: 0 8px;
`;
const ICTriangleBottomOutlinedIco = styled(ICTriangleBottomOutlined)`
  transform: rotate(-90deg);
  margin-top: 8px;
`;

const Step = () => {
  return (
    <StepFlexBox>
      {rulesStepsConfig.map((item, index) => {
        const { id, img, content } = item;
        return (
          <Box key={id}>
            <StepFlexItem>
              <Image src={img} alt={_t(content)} />
              <Text>{_t(content)}</Text>
            </StepFlexItem>
            {index < rulesStepsConfig.length - 1 ? (
              <ICTriangleBottomOutlinedIco className="horizontal-flip-in-arabic" size="15" />
            ) : null}
          </Box>
        );
      })}
    </StepFlexBox>
  );
};

export default Step;
