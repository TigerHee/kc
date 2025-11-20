/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback } from 'react';
import moment from 'moment';
import { trackClick } from 'utils/ga';
import { addLangToPath } from 'src/tools/i18n';
import { Wrapper, Content, Card, Image, CardTitle, Info } from './index.style';

export default ({ data }) => {
  const handleClick = useCallback((blockid) => {
    if (blockid) {
      trackClick([blockid, '1']);
    }
  }, []);

  return (
    <Wrapper>
      <Content>
        <Card
          href={addLangToPath(data.url)}
          key={data.key}
          onClick={() => {
            handleClick(data.blockid);
          }}
        >
          <Image src={data.img} alt="activity" />
          <CardTitle>{data.title}</CardTitle>
          <Info>
            {moment(data.startTime).format('YYYY/MM/DD')}-
            {moment(data.endTime).format('YYYY/MM/DD')}
          </Info>
        </Card>
      </Content>
    </Wrapper>
  );
};
