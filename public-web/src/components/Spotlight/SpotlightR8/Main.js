/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import NoSSG from 'src/components/NoSSG';
import ActiveProcess from './ActiveProcess';
const Wrapper = styled.section`
  width: 100%;
`;

const ProjectInfo = () => {
  return (
    <NoSSG>
      <Wrapper>
        <ActiveProcess />
      </Wrapper>
    </NoSSG>
  );
};

export default ProjectInfo;
